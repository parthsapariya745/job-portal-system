const QuickApplyButton = ({ phoneNumber, label = "CALL NOW" }) => {
  if (!phoneNumber) return null;

  return (
    <a
      href={`tel:${phoneNumber}`}
      className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white w-full h-[80px] rounded-2xl shadow-xl transition-all active:scale-95 border-4 border-green-400"
    >
      <span className="text-4xl">📞</span>
      <span className="text-2xl font-black tracking-wider">{label}</span>
    </a>
  );
};

export default QuickApplyButton;
