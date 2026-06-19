'use client';

import { useUIStore } from "@/lib/store/uiStore";
import ModalWrapper from "./ModalWrapper";
import ProjectForm from "./ProjectForm";

export default function GlobalCreateProjectModal() {
    const { isModalOpen, closeModal } = useUIStore();

    return (
        <ModalWrapper 
            isOpen={isModalOpen} 
            onClose={closeModal} 
            title="إنشاء تصميم مطبخ جديد"
            description="ابدأ تخصيص مطبخك وحساب عروض الأسعار تقريبياً"
        >
            <ProjectForm onSuccess={closeModal} />
        </ModalWrapper>
    );
}
