import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children, title, disableClose = false }) => {
    if (!isOpen) return null;
    
    return (
        <div 
            className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-hidden bg-black/40 backdrop-blur-sm"
            onClick={!disableClose ? onClose : undefined}
        >
            <div 
                className="relative p-4 w-full max-w-2xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 rounded-t-xl">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {title}
                        </h3>
                        {!disableClose && (
                            <button 
                                onClick={onClose}
                                type="button"
                                className="text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 rounded-lg text-sm w-9 h-9 flex items-center justify-center transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                aria-label="Close modal"
                            >
                                <X className="w-4 h-4"/>
                            </button>
                        )}
                    </div>

                    <div className="p-5 md:p-6 text-gray-700">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;