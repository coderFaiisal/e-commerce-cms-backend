/* eslint-disable @typescript-eslint/no-explicit-any */
export type TMonthData = { month: string; count: number };

export const generateLast12MonthsData = async (
  model: any,
): Promise<TMonthData[]> => {
  const last12Months: TMonthData[] = [];

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - i * 28,
    );

    const startDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate() - 28,
    );

    const monthYear = endDate.toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });

    const count = await model.countDocuments({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    last12Months.push({ month: monthYear, count });
  }

  return last12Months;
};

// const getPieChartData = async () => {
//   return '';
// };type TMonthData = { month: string; count: number };

// const getBarChartData = async () => {
//   return '';
// };
