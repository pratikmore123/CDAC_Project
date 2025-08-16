import { useState } from "react";
import { Image, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const EmojiPickerPopUp = ({ icon, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row items-start gap-5 mb-6 relative">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-4 cursor-pointer"
            >
                <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-purple-500 rounded-lg">
                    {icon ? (
                        <img src={icon} alt="Icon" className="w-12 h-12" />
                    ) : (
                        <Image className="w-6 h-6" />
                    )}
                </div>
                <p className="text-sm text-gray-600">{icon ? "Change icon" : "Pick icon"}</p>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-30">
                    <div className="relative bg-white rounded-lg shadow-xl">
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -right-2 -top-2 z-20 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                        <div className="overflow-y-auto max-h-[70vh]">
                            <EmojiPicker 
                                width={300}
                                height={400}
                                onEmojiClick={(emoji) => {
                                    onSelect(emoji.imageUrl);
                                    setIsOpen(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmojiPickerPopUp;