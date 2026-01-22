import html2canvas from 'html2canvas';

export const exportAsImage = async (elementId: string, fileName: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Retine quality
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${fileName}.png`;
    link.click();
  } catch (error) {
    console.error('Export failed:', error);
  }
};
