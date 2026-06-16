"use client";

import React, { useState } from "react";

type TaskCardProps = {
    title: string;
    description: string;
    priority: string;
    status?: string;
    assignee?: string;
    dueDate?: string | null;
    onDelete?: () => void;
};

function formatDate(date: string) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

const TaskCard = ({ title, description, priority, status, assignee, dueDate, onDelete }: TaskCardProps) => {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const bgClass =
        priority.toLowerCase() === "high"
            ? "bg-red-400"
            : priority.toLowerCase() === "medium"
            ? "bg-yellow-400"
            : "bg-green-400";

    const isOverdue = dueDate && status !== "done" ? new Date(dueDate) < new Date() : false;

    return (
        <div className={`flex h-auto w-full self-start flex-col rounded-2xl border-2 border-black overflow-hidden shrink-0 ${bgClass}`}>
            <div className="bg-black p-3 text-xl font-bold text-teal-200 flex justify-between items-center">
                <h2 className="truncate">{title}</h2>
                {onDelete && !confirmDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                        className="text-red-400 hover:text-red-300 text-sm ml-2"
                    >
                        ✕
                    </button>
                )}
                {onDelete && confirmDelete && (
                    <div className="flex gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => onDelete()}
                            className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-lg hover:bg-red-600"
                        >
                            Delete
                        </button>
                        <button
                            onClick={() => setConfirmDelete(false)}
                            className="text-xs bg-gray-500 text-white px-2 py-0.5 rounded-lg hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="p-3">
                <div className="rounded-xl border border-black bg-teal-200 p-3 text-sm break-words">
                    {description}
                </div>

                <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
                    {assignee && (
                        <span className="bg-black text-teal-200 px-2 py-1 rounded-full">
                            👤 {assignee}
                        </span>
                    )}
                    {dueDate && (
                        <span className={`px-2 py-1 rounded-full ${isOverdue ? 'bg-red-700 text-white' : 'bg-black text-teal-200'}`}>
                            📅 {formatDate(dueDate)} {isOverdue && '⚠ OVERDUE'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};


export default TaskCard;