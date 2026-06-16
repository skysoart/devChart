"use client";

import React, { useState } from "react";

type Task = {
    _id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    assignee?: string;
    dueDate?: string | null;
};

type TaskModalProps = {
    task: Task;
    onClose: () => void;
    onSave: (updated: Task) => void;
};

export default function TaskModal({ task, onClose, onSave }: TaskModalProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [priority, setPriority] = useState(task.priority);
    const [status, setStatus] = useState(task.status);
    const [assignee, setAssignee] = useState(task.assignee || "");
    const [dueDate, setDueDate] = useState(
        task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
    );
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        setSaving(true);
        try {
            const body = {
                title,
                description,
                priority,
                status,
                assignee,
                dueDate: dueDate ? new Date(dueDate) : null,
            };

            const response = await fetch(`/api/tasks/${task._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                const updated = await response.json();
                onSave(updated);
            }
        } catch (error) {
            console.error("Failed to save:", error);
        }
        setSaving(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50" />

            <div
                className="relative bg-white rounded-2xl border-2 border-black w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Edit Task</h2>
                    <button onClick={onClose} className="text-2xl hover:text-red-500">✕</button>
                </div>

                <div className="flex flex-col gap-3">
                    <label className="font-bold">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />

                    <label className="font-bold">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />

                    <label className="font-bold">Priority</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <label className="font-bold">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>

                    <label className="font-bold">Assignee</label>
                    <input
                        type="text"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        placeholder="Member name (optional)"
                        className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />

                    <label className="font-bold">Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full p-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full p-3 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 disabled:opacity-50 mt-2"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}