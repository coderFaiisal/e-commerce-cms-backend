export const generateTrackingNumber = (): string => {
  const date = new Date();

  const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;

  const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();

  return `TXN-${formattedDate}-P${randomPart}`;
};
