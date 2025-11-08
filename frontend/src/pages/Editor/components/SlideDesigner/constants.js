
export const FONT_OPTIONS = [
    { value: 'Arial, sans-serif', label: 'Arial', type: 'english' },
    { value: "'Times New Roman', serif", label: 'Times New Roman', type: 'english' },
    { value: "'Courier New', monospace", label: 'Courier New', type: 'english' },
    { value: 'Tahoma, sans-serif', label: 'Tahoma', type: 'english' },
    { value: "'Segoe UI', sans-serif", label: 'Segoe UI', type: 'english' },
    { value: "'Cairo', sans-serif", label: 'Cairo', type: 'arabic' },
    { value: "'Tajawal', sans-serif", label: 'Tajawal', type: 'arabic' },
    { value: "'Amiri', serif", label: 'Amiri', type: 'arabic' },
    { value: "'Almarai', sans-serif", label: 'Almarai', type: 'arabic' },
    { value: "'Changa', sans-serif", label: 'Changa', type: 'arabic' },
    { value: "'El Messiri', sans-serif", label: 'El Messiri', type: 'arabic' },
    { value: "'Lalezar', cursive", label: 'Lalezar', type: 'arabic' },
    { value: "'Reem Kufi', sans-serif", label: 'Reem Kufi', type: 'arabic' },
    { value: "'Scheherazade New', serif", label: 'Scheherazade', type: 'arabic' },
    { value: "'IBM Plex Sans Arabic', sans-serif", label: 'IBM Plex Arabic', type: 'arabic' }
];

export const getDefaultSize = (type) => {
    const sizes = {
        title: { width: 400, height: 80 },
        text: { width: 350, height: 120 },
        bullet_points: { width: 350, height: 150 },
        quote: { width: 450, height: 100 },
        code: { width: 450, height: 180 },
        image: { width: 250, height: 200 },
        video: { width: 320, height: 240 }
    };
    return sizes[type] || { width: 200, height: 100 };
};

export const getDefaultStyle = (type) => ({
    fontFamily: 'Arial, sans-serif',
    fontSize: type === 'title' ? '36px' : type === 'quote' ? '24px' : '18px',
    color: type === 'code' ? '#e2e8f0' : '#2d3748',
    backgroundColor: type === 'code' ? '#2d3748' : 'transparent',
    textAlign: 'right',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none'
});

export const getDefaultContent = (type) => {
    const contents = {
        title: 'العنوان الرئيسي',
        text: 'هذا نص عادي يمكنك تعديله حسب احتياجاتك',
        bullet_points: '• النقطة الأولى\n• النقطة الثانية\n• النقطة الثالثة',
        quote: 'هذا اقتباس ملهم يمكنك تعديله ليناسبك',
        code: '// كود مثال\nfunction example() {\n  return "Hello World";\n}'
    };
    return contents[type] || '';
};