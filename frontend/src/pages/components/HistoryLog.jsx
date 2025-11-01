import React, { useEffect, useState } from "react";
import { getHistory } from "../../api/history";

export default function HistoryLog({ slideId }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (slideId) {
            getHistory(slideId).then((res) => setLogs(res.data));
        }
    }, [slideId]);

    return (
        <div className="border p-3 rounded-md bg-gray-50">
            <h3 className="font-semibold mb-2">History</h3>
            <ul className="space-y-1 text-sm">
                {logs.map((log) => (
                    <li key={log.id}>
                        <span className="text-gray-700">{log.action}</span> -{" "}
                        <span className="text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}