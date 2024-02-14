export const getPhaseData = () =>
  Array.from({ length: 100 }, (_, index) => {
    const frameNo = index > 20 ? ((index % 20) + 1) * 2 : (index + 1) * 2;
    return {
      phase: index + 1,
      count: 30,
      spriteKey: "pixel_animals",
      frameNo,
    };
  });
