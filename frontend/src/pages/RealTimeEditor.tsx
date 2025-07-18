import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import "./RealTimeEditor.css";
import config from "@/config";
import { Socket } from "socket.io-client";
import * as monaco from "monaco-editor";
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';

export default function RealTimeCodeEditor() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [editorReady, setEditorReady] = useState(false);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const ydocRef = useRef<Y.Doc | null>(null);
    const providerRef = useRef<WebsocketProvider | null>(null);
    const bindingRef = useRef<MonacoBinding | null>(null);

    // Initialize Yjs document and websocket provider
    useEffect(() => {
        // Create Yjs document
        const ydoc = new Y.Doc();
        ydocRef.current = ydoc;

        // Create websocket provider for Yjs
        // Replace 'ws://localhost:1234' with your Yjs websocket server URL
        const provider = new WebsocketProvider('ws://localhost:1234', 'monaco-room', ydoc);
        providerRef.current = provider;

        // Optional: Initialize socket.io connection if you still need it for other features
        const socketUrl = config.SOCKET_URL;
        const s = io(socketUrl);
        setSocket(s);

        return () => {
            // Cleanup
            if (bindingRef.current) {
                bindingRef.current.destroy();
            }
            if (providerRef.current) {
                providerRef.current.destroy();
            }
            if (ydocRef.current) {
                ydocRef.current.destroy();
            }
            s.disconnect();
        };
    }, []);

    const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
        setEditorReady(true);
    };

    // Set up Yjs binding when editor is ready
    useEffect(() => {
        if (!editorRef.current || !ydocRef.current || !editorReady) return;

        // Get the shared text type from Yjs document
        const ytext = ydocRef.current.getText('monaco');
        
        // Create Monaco binding
        const binding = new MonacoBinding(
            ytext,
            editorRef.current.getModel()!,
            new Set([editorRef.current]),
            providerRef.current?.awareness
        );
        
        bindingRef.current = binding;

        // Optional: Set initial content if the document is empty
        if (ytext.length === 0) {
            ytext.insert(0, '// Start coding here...');
        }

        return () => {
            if (bindingRef.current) {
                bindingRef.current.destroy();
                bindingRef.current = null;
            }
        };
    }, [editorReady]);

    // Optional: Add connection status indicators
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

    useEffect(() => {
        if (!providerRef.current) return;

        const provider = providerRef.current;

        const handleStatus = (event: { status: string }) => {
            setConnectionStatus(event.status as 'connecting' | 'connected' | 'disconnected');
        };

        provider.on('status', handleStatus);

        return () => {
            provider.off('status', handleStatus);
        };
    }, []);

    return (
        <div className="code-editor-container">
            <div className="connection-status">
                Status: <span className={`status-${connectionStatus}`}>{connectionStatus}</span>
            </div>
            <Editor
                height="1000px"
                width={"1000px"}
                defaultLanguage="javascript"
                defaultValue="" // Remove default value as Yjs will handle content
                theme="vs-dark"
                onMount={handleEditorMount}
                options={{
                    minimap: { enabled: true },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true,
                    lineNumbers: "on",
                    tabSize: 2
                }}
            />
        </div>
    );
}