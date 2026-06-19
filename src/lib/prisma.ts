import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  isDatabaseOffline?: boolean
}

const actualPrisma =
  globalForPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = actualPrisma

// Initialize offline status if configured in environment
if (process.env.OFFLINE_MODE === 'true') {
  globalForPrisma.isDatabaseOffline = true;
}

function isConnectionError(error: any): boolean {
  const msg = error?.message || '';
  return (
    msg.includes("Can't reach database server") ||
    msg.includes("Failed to connect") ||
    msg.includes("Timed out") ||
    msg.includes("connection limit") ||
    msg.includes("Connection refused") ||
    error?.code === 'P1001' || // Can't reach database server
    error?.code === 'P1002' || // Connection timeout
    error?.code === 'P1008' || // Operations timeout
    error?.code === 'P1017'    // Server closed connection
  );
}

// Wrap prisma client in a Proxy to handle offline detection and fast fallback
export const prisma = new Proxy(actualPrisma, {
  get(target, prop, receiver) {
    // If database is offline, intercept immediately and throw fast error
    if (globalForPrisma.isDatabaseOffline) {
      if (typeof prop === 'string' && prop.startsWith('$')) {
        return async (...args: any[]) => {
          if (prop === '$queryRaw') {
            throw new Error("Database is offline (Fast Fallback)");
          }
          if (prop === '$transaction') {
            const callback = args[0];
            if (typeof callback === 'function') {
              // Run the transaction callback passing this proxied client
              return callback(prisma);
            }
          }
          throw new Error(`Database operation ${String(prop)} blocked in offline mode.`);
        };
      }

      // Return a model-like delegate that throws on every method invocation
      return new Proxy({}, {
        get(_, modelProp) {
          return async () => {
            throw new Error(`Database query on model blocked in offline mode.`);
          };
        }
      });
    }

    const value = Reflect.get(target, prop, receiver);

    // Intercept client helper functions/methods
    if (typeof value === 'function') {
      return async function (...args: any[]) {
        try {
          return await value.apply(target, args);
        } catch (error: any) {
          if (isConnectionError(error)) {
            globalForPrisma.isDatabaseOffline = true;
            console.warn("Database connection failed. Switching to OFFLINE MODE (fast fallback active).");
          }
          throw error;
        }
      };
    }

    // Intercept model methods (e.g. prisma.project.findMany)
    if (value && typeof value === 'object') {
      return new Proxy(value, {
        get(modelTarget, modelProp, modelReceiver) {
          const modelValue = Reflect.get(modelTarget, modelProp, modelReceiver);
          if (typeof modelValue === 'function') {
            return async function (...args: any[]) {
              try {
                return await modelValue.apply(modelTarget, args);
              } catch (error: any) {
                if (isConnectionError(error)) {
                  globalForPrisma.isDatabaseOffline = true;
                  console.warn(`Database connection failed on query. Switching to OFFLINE MODE (fast fallback active). Error: ${error.message}`);
                }
                throw error;
              }
            };
          }
          return modelValue;
        }
      });
    }

    return value;
  }
});
