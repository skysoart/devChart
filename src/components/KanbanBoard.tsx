"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";

type Task = {
    _id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    assignee?: string;
    dueDate?: string | null;
};

const columns = [
    { id: "todo", title: "📋 To Do" },
    { id: "in-progress", title: "🔨 In Progress" },
    { id: "done", title: "✅ Done" },
];

export default function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    async function fetchTasks() {
        const response = await fetch("/api/tasks");
        const data = await response.json();
        const normalized = data.map((t: Task & { completed?: boolean }) => ({
            ...t,
            status: t.status || (t.completed ? "done" : "todo"),
        }));
        setTasks(normalized);
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    function getTasksForColumn(columnId: string) {
        const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
        return tasks
            .filter((t) => t.status === columnId)
            .sort((a, b) => (order[a.priority.toLowerCase()] ?? 3) - (order[b.priority.toLowerCase()] ?? 3));
    }

    async function handleDragEnd(result: DropResult) {
        const { draggableId, destination } = result;
        if (!destination) return;

        const newStatus = destination.droppableId;

        setTasks((prev) =>
            prev.map((t) => (t._id === draggableId ? { ...t, status: newStatus } : t))
        );

        try {
            await fetch(`/api/tasks/${draggableId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (error) {
            console.error("Failed to update status:", error);
            fetchTasks();
        }
    }

    async function handleDelete(id: string) {
        setTasks((prev) => prev.filter((t) => t._id !== id));

        try {
            await fetch(`/api/tasks/${id}`, { method: "DELETE" });
        } catch (error) {
            console.error("Failed to delete:", error);
            fetchTasks();
        }
    }

    function handleSave(updated: Task) {
        setTasks((prev) =>
            prev.map((t) => (t._id === updated._id ? updated : t))
        );
        setEditingTask(null);
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-4 p-4 min-h-[calc(100vh-64px)]">
                {columns.map((col) => (
                    <Droppable droppableId={col.id} key={col.id}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`flex-1 rounded-2xl border-2 border-black p-3 min-h-[200px] transition-colors ${
                                    snapshot.isDraggingOver ? "bg-teal-100" : "bg-white/50"
                                }`}
                            >
                                <h2 className="text-xl font-bold mb-3 text-black border-b-2 border-black pb-2">
                                    {col.title}
                                    <span className="ml-2 text-sm bg-black text-teal-200 px-2 py-0.5 rounded-full">
                                        {getTasksForColumn(col.id).length}
                                    </span>
                                </h2>

                                <div className="flex flex-col gap-3">
                                    {getTasksForColumn(col.id).map((task, index) => (
                                        <Draggable
                                            key={task._id}
                                            draggableId={task._id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        transition: snapshot.isDropAnimating
                                                            ? "all 0.2s ease"
                                                            : provided.draggableProps.style?.transition,
                                                    }}
                                                    className={
                                                        snapshot.isDragging
                                                            ? "shadow-xl rotate-1 opacity-90"
                                                            : ""
                                                    }
                                                >
                                                    <div onClick={() => setEditingTask(task)} className="cursor-pointer">
                                                        <TaskCard
                                                            title={task.title}
                                                            description={task.description}
                                                            priority={task.priority}
                                                            status={task.status}
                                                            assignee={task.assignee}
                                                            dueDate={task.dueDate}
                                                            onDelete={() => handleDelete(task._id)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                </div>

                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>

            {editingTask && (
                <TaskModal
                    task={editingTask}
                    onClose={() => setEditingTask(null)}
                    onSave={handleSave}
                />
            )}
        </DragDropContext>
    );
}