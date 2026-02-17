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
            title="Create New Project"
            description="Start a new design journey"
        >
            <ProjectForm onSuccess={closeModal} />
        </ModalWrapper>
    );
}
