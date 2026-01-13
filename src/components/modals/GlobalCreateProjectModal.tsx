'use client';

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { closeModal } from "@/lib/features/ui/uiSlice";
import ModalWrapper from "./ModalWrapper";
import ProjectForm from "./ProjectForm";

export default function GlobalCreateProjectModal() {
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector((state) => state.ui.isModalOpen);

    return (
        <ModalWrapper 
            isOpen={isOpen} 
            onClose={() => dispatch(closeModal())} 
            title="Initialize_New_Project_Node"
        >
            <ProjectForm onSuccess={() => dispatch(closeModal())} />
        </ModalWrapper>
    );
}
