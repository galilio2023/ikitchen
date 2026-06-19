import { prisma } from "@/lib/prisma";

export interface ProjectSummary {
  id: string;
  clientName: string;
  status: string;
  progress: number;
  updatedAt: Date;
  kitchen?: {
    id: string;
    phone: string;
    address: string | null;
    totalPrice: number;
    layoutShape: string;
    kitchenRole: string;
    region: string;
    cabinetMaterial: string;
    countertopMaterial: string;
    hardwareTier: string;
  } | null;
}

export async function getProjects(): Promise<ProjectSummary[]> {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { kitchen: true }
    });

    return projects.map((p) => ({
      id: p.id,
      clientName: p.client,
      status: p.status || 'Draft',
      progress: p.progress || 0,
      updatedAt: p.updatedAt || new Date(),
      kitchen: p.kitchen ? {
        id: p.kitchen.id,
        phone: p.kitchen.phone,
        address: p.kitchen.address,
        totalPrice: p.kitchen.totalPrice,
        layoutShape: p.kitchen.layoutShape,
        kitchenRole: p.kitchen.kitchenRole,
        region: p.kitchen.region,
        cabinetMaterial: p.kitchen.cabinetMaterial,
        countertopMaterial: p.kitchen.countertopMaterial,
        hardwareTier: p.kitchen.hardwareTier,
      } : null
    }));
  } catch (error) {
    console.log("Database offline: Returning mock projects list fallback.");
    return [
      {
        id: "mock-project-1",
        clientName: "أحمد بن عبد العزيز (الرياض)",
        status: "Designing",
        progress: 75,
        updatedAt: new Date(),
        kitchen: {
          id: "mock-kitchen-1",
          phone: "+966500000000",
          address: "الرياض، حي الياسمين",
          totalPrice: 28500,
          layoutShape: "L",
          kitchenRole: "show",
          region: "Gulf",
          cabinetMaterial: "Acrylic Turkish/Spanish",
          countertopMaterial: "Premium Quartz",
          hardwareTier: "Premium (Blum/Hettich)"
        }
      },
      {
        id: "mock-project-2",
        clientName: "مهندس شريف محمود (التجمع الخامس)",
        status: "Draft",
        progress: 30,
        updatedAt: new Date(Date.now() - 3600000 * 24),
        kitchen: {
          id: "mock-kitchen-2",
          phone: "+201000000000",
          address: "القاهرة الجديدة، التجمع الخامس",
          totalPrice: 13500,
          layoutShape: "I",
          kitchenRole: "standard",
          region: "Egypt",
          cabinetMaterial: "Alumetal Standard",
          countertopMaterial: "Local Granite",
          hardwareTier: "Standard"
        }
      },
      {
        id: "mock-project-3",
        clientName: "د. سارة الهاشمي (دبي)",
        status: "Completed",
        progress: 100,
        updatedAt: new Date(Date.now() - 3600000 * 48),
        kitchen: {
          id: "mock-kitchen-3",
          phone: "+971500000000",
          address: "دبي، نخلة جميرا",
          totalPrice: 42000,
          layoutShape: "U",
          kitchenRole: "show",
          region: "Gulf",
          cabinetMaterial: "Solid Wood Premium",
          countertopMaterial: "Imported Marble",
          hardwareTier: "Premium (Blum/Hettich)"
        }
      },
      {
        id: "mock-project-4",
        clientName: "أ. كريم عبد الهادي (الإسكندرية)",
        status: "Designing",
        progress: 60,
        updatedAt: new Date(Date.now() - 3600000 * 72),
        kitchen: {
          id: "mock-kitchen-4",
          phone: "+201200000000",
          address: "الإسكندرية، سموحة",
          totalPrice: 21500,
          layoutShape: "L",
          kitchenRole: "wet",
          region: "Egypt",
          cabinetMaterial: "Khashamium Premium",
          countertopMaterial: "Local Granite",
          hardwareTier: "Standard"
        }
      }
    ];
  }
}

export async function getProjectStats(projects: ProjectSummary[]) {
  return {
    total: projects.length,
    completed: projects.filter((p) => p.progress === 100).length,
    averageProgress:
      projects.length > 0
        ? Math.round(
            projects.reduce((acc, p) => acc + (p.progress || 0), 0) /
              projects.length,
          )
        : 0,
  };
}

export async function getProjectWithKitchen(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });
    
    const kitchen = await prisma.kitchen.findUnique({
      where: { projectId: projectId }
    });

    if (!project || !kitchen) {
      if (projectId.startsWith("mock-")) {
        return getMockProjectData(projectId);
      }
      return null;
    }

    // Robust serialization for Client Components
    return {
      project: JSON.parse(JSON.stringify(project)),
      kitchen: JSON.parse(JSON.stringify(kitchen)),
    };
  } catch (error) {
    console.log("Database offline: Returning mock project and kitchen details fallback.");
    return getMockProjectData(projectId);
  }
}

function getMockProjectData(projectId: string) {
  const isGulf = projectId === "mock-project-1" || projectId === "mock-project-3";
  const isSara = projectId === "mock-project-3";
  const isKareem = projectId === "mock-project-4";

  let clientName = "أحمد بن عبد العزيز (الرياض)";
  let phone = "+966500000000";
  let address = "الرياض، حي الياسمين";
  let totalPrice = 28500;
  let layoutShape = "L";
  let kitchenRole = "show";
  let region = "Gulf";
  let cabinetMaterial = "Acrylic Turkish/Spanish";
  let countertopMaterial = "Premium Quartz";
  let hardwareTier = "Premium (Blum/Hettich)";
  let walls = [
    { id: "wall-a", label: "Wall A", length: 320, height: 240, thickness: 10 },
    { id: "wall-b", label: "Wall B", length: 240, height: 240, thickness: 10 }
  ];
  let aiReasoning = "لقد صممنا هذا المطبخ التحضيري المفتوح على المعيشة ليتناسب مع نمط الحياة الخليجي العصري. يركز التوزيع على مثلث الحركة المريح بمساحات تخزين مريحة.";
  let instructions = "السلام عليكم، قمت بتصميم مطبخ شو مفتوح (حرف L) على موقعكم بالخامات الآتية: أكريليك تركي وكونترتوب كوارتز بريميوم. مقاس الحوائط: الحائط الرئيسي 3.2 متر والحائط الجانبي 2.4 متر. أود حجز موعد لرفع المقاسات مجاناً وتأكيد المواصفات.";

  if (isSara) {
    clientName = "د. سارة الهاشمي (دبي)";
    phone = "+971500000000";
    address = "دبي، نخلة جميرا";
    totalPrice = 42000;
    layoutShape = "U";
    cabinetMaterial = "Solid Wood Premium";
    countertopMaterial = "Imported Marble";
    walls = [
      { id: "wall-a", label: "Wall A", length: 360, height: 240, thickness: 10 },
      { id: "wall-b", label: "Wall B", length: 300, height: 240, thickness: 10 }
    ];
    aiReasoning = "تصميم مطبخ كلاسيكي فاخر مبني من الخشب الطبيعي الممتاز المعالج وأسطح الرخام المستورد الفخم، مما يوفر طابعاً دافئاً وتوزيعاً مريحاً للأجهزة المدمجة.";
    instructions = "السلام عليكم، قمت بتصميم مطبخ كلاسيكي خشبي فاخر على موقعكم. أود الاستفسار وحجز موعد لرفع مقاسات الموقع مجاناً.";
  } else if (isKareem) {
    clientName = "أ. كريم عبد الهادي (الإسكندرية)";
    phone = "+201200000000";
    address = "الإسكندرية، سموحة";
    totalPrice = 21500;
    region = "Egypt";
    cabinetMaterial = "Khashamium Premium";
    walls = [
      { id: "wall-a", label: "Wall A", length: 340, height: 240, thickness: 10 }
    ];
    aiReasoning = "مطبخ خدمة مغلق مقاوم تماماً للدهون والرطوبة بخامات خشمونيوم أنيقة وعملية، مع أسطح الجرانيت المحلي التي تتحمل ظروف التشغيل الشاقة.";
    instructions = "السلام عليكم، صممت مطبخ خشمونيوم عملي (L-Shape) على موقعكم. أود الاستفسار وتحديد موعد لرفع مقاسات المطبخ مجاناً بالمنزل.";
  } else if (!isGulf) {
    clientName = "مهندس شريف محمود (التجمع الخامس)";
    phone = "+201000000000";
    address = "القاهرة الجديدة، التجمع الخامس";
    totalPrice = 13500;
    layoutShape = "I";
    kitchenRole = "standard";
    region = "Egypt";
    cabinetMaterial = "Alumetal Standard";
    countertopMaterial = "Local Granite";
    hardwareTier = "Standard";
    walls = [
      { id: "wall-a", label: "Wall A (Main)", length: 300, height: 240, thickness: 10 }
    ];
    aiReasoning = "مطبخ عائلي قياسي مصمم للاستخدام اليومي المستمر. خامات ألوميتال عملية مقاومة للمياه وسهلة التنظيف مع حجر الجرانيت المحلي المناسب للطهي الشاق.";
    instructions = "السلام عليكم، قمت بتصميم مطبخ عائلي قياسي (مستقيم) على موقعكم بخامات الألوميتال العملي وجرانيت محلي. مقاس الحائط: 3.0 متر. أود الاستفسار وحجز موعد لرفع المقاسات مجاناً.";
  }

  return {
    project: {
      id: projectId || "mock-project-1",
      client: clientName,
      status: isSara ? "Completed" : (isKareem || isGulf ? "Designing" : "Draft"),
      progress: isSara ? 100 : (isGulf ? 75 : (isKareem ? 60 : 30)),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    kitchen: {
      id: isSara ? "mock-kitchen-3" : (isKareem ? "mock-kitchen-4" : (isGulf ? "mock-kitchen-1" : "mock-kitchen-2")),
      projectId: projectId || "mock-project-1",
      clientName,
      phone,
      address,
      kitchenRole,
      layoutShape,
      region,
      cabinetMaterial,
      countertopMaterial,
      hardwareTier,
      walls,
      totalPrice,
      standards: {
        householdSize: "4-6",
        styleId: isGulf ? "modern_minimal" : "standard_alumetal"
      },
      generatedDesign: {
        aiReasoning,
        instructions
      }
    }
  };
}
