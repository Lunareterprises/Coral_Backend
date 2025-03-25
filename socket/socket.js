module.exports = function (io) {
    // In-memory structures for managing available admins and user queues
    let availableAdmins = [];  // List of available admin IDs
    let userQueue = [];  // Queue of users waiting for admin help

    io.on('connection', (socket) => {
        console.log('A user or admin connected:', socket.id);

        // Admin Login & Availability
        socket.on('admin:login', (adminId) => {
            console.log(`Admin ${adminId} logged in`);
            availableAdmins.push(adminId);
            io.to(adminId).emit('admin:status', { available: true });

            if (userQueue.length > 0) {
                const nextUser = userQueue.shift();
                io.to(adminId).emit('admin:newChat', { userId: nextUser.userId, message: nextUser.message });
                io.to(nextUser.userId).emit('user:receiveMessage', { adminId, message: "An admin is available to help you!" });
            }
        });

        // User Sends Message (Goes to Queue or Admin)
        socket.on('user:sendMessage', (data) => {
            const { userId, message } = data;
            console.log(`User ${userId} sent message: ${message}`);

            if (availableAdmins.length > 0) {
                const adminId = availableAdmins.pop();
                io.to(adminId).emit('admin:newChat', { userId, message });
                io.to(userId).emit('user:receiveMessage', { adminId, message: "An admin is available to help you!" });
            } else {
                userQueue.push({ userId, message });
                console.log(`User ${userId} added to the queue`);
            }
        });

        // Admin Sends Message to User (NEW EVENT)
        socket.on('admin:sendMessage', (data) => {
            console.log("data : ", data)
            const { adminId, userId, message } = data;
            console.log(`Admin ${adminId} sent message to user ${userId}: ${message}`);
            io.to(userId).emit('user:receiveMessage', { adminId, message });
        });

        // Admin Toggles Availability
        socket.on('admin:toggleAvailability', (adminId, isAvailable) => {
            if (isAvailable) {
                availableAdmins.push(adminId);
                if (userQueue.length > 0) {
                    const nextUser = userQueue.shift();
                    io.to(adminId).emit('admin:newChat', { userId: nextUser.userId, message: nextUser.message });
                    io.to(nextUser.userId).emit('user:receiveMessage', { adminId, message: "An admin is available to help you!" });
                }
            } else {
                const index = availableAdmins.indexOf(adminId);
                if (index > -1) availableAdmins.splice(index, 1);
            }
        });

        // Admin Finishes Chat
        socket.on('admin:finishChat', (adminId, userId) => {
            availableAdmins.push(adminId);
            io.to(userId).emit('user:receiveMessage', { adminId, message: "Thank you for chatting with us!" });

            if (userQueue.length > 0) {
                const nextUser = userQueue.shift();
                io.to(adminId).emit('admin:newChat', { userId: nextUser.userId, message: nextUser.message });
                io.to(nextUser.userId).emit('user:receiveMessage', { adminId, message: "An admin is available to help you!" });
            }
        });

        // Admin Invites Another Expert
        socket.on('admin:inviteExpert', (fromAdminId, toAdminId, userId) => {
            io.to(toAdminId).emit('admin:joinChat', { userId, message: `You have been invited to assist user ${userId}` });
            io.to(userId).emit('user:receiveMessage', { adminId: fromAdminId, message: "Another expert admin is joining your chat." });
        });

        // Disconnection Handling
        socket.on('disconnect', () => {
            const adminIndex = availableAdmins.indexOf(socket.id);
            if (adminIndex > -1) availableAdmins.splice(adminIndex, 1);
            userQueue = userQueue.filter(user => user.userId !== socket.id);
        });
    });
};