// hooks/useSignalR.ts
import * as signalR from '@microsoft/signalr';
import { useEffect, useState } from 'react';

interface SignalRConnection {
    connection: signalR.HubConnection | null;
}

const useSignalR = (chatId: number | null, callback: () => void): SignalRConnection => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);


    useEffect(() => {
        const connect = async () => {
            if (!chatId) {
                return
            }

            const connection = new signalR.HubConnectionBuilder()
                //@ts-ignore 
                .withUrl(import.meta.env.VITE_PUBLIC_CHAT_URL + chatId, {
                    skipNegotiation: true,
                    transport: signalR.HttpTransportType.WebSockets,
                })
                .configureLogging(signalR.LogLevel.Information)
                .build()


            connection.on('NewMessageInChat', (user: string, message: string) => {
                console.log(`User: ${user}, Message: ${message}`);

                callback()
            });

            try {
                await connection.start();
                console.log('SignalR Connected.');
            } catch (err) {
                console.error('SignalR Connection Error: ', err);
            }

            setConnection(connection);
        };

        connect();

        return () => {
            if (connection) {
                connection.stop().then(() => {
                    console.error('SignalR Disconnected.');
                    setConnection(null); // Ensure the connection is nullified
                })
                    .catch((err) => console.error('SignalR Disconnection Error: ', err));;
            }
        };
    }, [chatId]);

    return { connection };
};

export default useSignalR;