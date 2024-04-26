// * Explore and implement Invoice
// * Implement logic in where store-owner will notify about the subscription time expiration. After the subscription time end, database will update and subscription isActive=false and other related things will happened.
// * Notify user and store owner or admin after payment ipn completed.

// * Create more analytics query based on requirements.
// * Research further more and try to complete backend.

// * Send email after order and subscription completed.
// * notification = {title: string, message: string, status: "read" | "unread", userId: ObjectId}

// * cron-job for automatically done something.
// * node-cron - package

// cron.schedule('0 0 0 * * *', async () => {
//   const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
//   await Notification.deleteMany({
//     status: 'read',
//     createdAt: { $lt: thirtyDaysAgo },
//   });
// });




// await redis.set(productId, JSON.stringify(product), 'EX', 604800)
