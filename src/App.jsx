import React, { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import {
  FileText,
  ClipboardList,
  Download,
  Plus,
  Trash2,
  Sparkles,
  ArrowLeft,
  Eye,
  CreditCard,
  Building,
  User,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  Sliders,
  Check,
  Layers,
  X,
  Share2
} from "lucide-react";

export default function App() {
  // --- VIEW STATE: 'form' (Inputs Only), 'preview' (A4 View Only) ---
  const [viewState, setViewState] = useState("form"); 
  const [activeTab, setActiveTab] = useState("invoice"); // 'invoice' or 'amc'
  
  // --- FIVE PREMIUM TEMPLATE THEMING: 1 (Navy/Gold), 2 (SkyBlue), 3 (Emerald), 4 (SlateMinimal), 5 (CrimsonSunset) ---
  const [activeTemplate, setActiveTemplate] = useState(1); 
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  const [theme, setTheme] = useState("dark"); // 'dark' or 'light'
  const [zoom, setZoom] = useState(0.85); // A4 preview scale zoom
  const [mobileScale, setMobileScale] = useState(1); // Auto-scale to fit mobile viewports
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [shareFallbackData, setShareFallbackData] = useState(null);
  const pdfRef = useRef();

  // --- PWA INSTALLATION DETECTOR ---
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("PWA Installation user outcome:", outcome);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // --- AUTO RESPONSIVE A4 SCALE LISTENER ---
  useEffect(() => {
    const handleResize = () => {
      const targetWidth = 794; // 210mm A4 width in px at standard dpi
      const screenWidth = window.innerWidth;
      
      // Calculate dynamic ratio with side padding
      if (screenWidth < targetWidth + 32) {
        const calculatedScale = (screenWidth - 32) / targetWidth;
        setMobileScale(calculatedScale);
      } else {
        setMobileScale(1);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // trigger initially
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- EXACT BRANDING CONSTRAINTS (2nd Image) ---
  const [shopDetails, setShopDetails] = useState({
    name: "RePaiRingWallaH",
    tagline: "All types of refrigerators, air conditioners, washing machines and microwave repairs",
    address: "Pakhadi Cottage, Shop No. 6, Nehru Road, Navpada, Vile Parle East",
    pincode: "400057",
    mobile: "8104609070",
    email: "repairingwallah57@gmail.com",
    state: "27-Maharashtra",
    authSignatory: "Salman",
  });

  // --- INVOICE STATE ---
  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: "",
    date: "",
    warrantyPeriod: "",
    clientName: "",
    clientAddress: "",
    clientMobile: "",
    clientState: "",
    receivedAmount: "",
    notes: "",
    terms: "",
    bankName: "",
    accountNo: "",
    ifscCode: "",
    accountName: "",
    items: [
      {
        name: "",
        hsn: "",
        qty: "",
        price: "",
      },
    ],
    descriptionList: [
      "Service contract only for service. In service contract not included any part Gas etc. If any part problem, I charge only material charge, no labour charge.",
      "Water leakage problem included in service contract.",
      "In maintenance contract included four service (One Wet Service and Three Dry Service) and all Electrical part, Gas, Compressor, Cooling coil, Condenser, In door unit fan blade and Fan Motor, Out door unit Fan blade and Fan Motor. (If Condenser is aluminum then not include In contract)",
      "In maintenance contract not included Remote and Ac body.",
      "Our service provides for machines attended by specially trained and experienced technicians.",
      "All work will be carried during business hours on working days only.",
      "All breakdown call will be attended during business hours on working days within 24 hours.",
      "All breakdown call will be attended at no extra cost during the period of maintenance contract.",
      "The contract is sent in duplicate for your convenience. Kindly fill in the particulars and return one copy to enable us to register your name in our service list.",
    ]
  });

  // --- AMC STATE ---
  const [amcData, setAmcData] = useState({
    clientName: "",
    address: "",
    mobile: "",
    email: "",
    brand: "",
    model: "",
    type: "",
    capacity: "",
    qty: "",
    fromDate: "",
    toDate: "",
    totalAmount: "",
    paymentMode: "",
    servicesCovered: [
      "Four routine services per year (Indoor & Outdoor cleaning).",
      "Coil, filter, and blower cleaning.",
      "Electrical & cooling performance check.",
      "Gas pressure check and minor top-up (if required).",
      "Attending complaints within 24-48 hours.",
    ],
    servicesNotCovered: [
      "Compressor, PCB, Fan motor, or sensor replacement.",
      "Gas filling in case of leakage.",
      "Any physical or electrical damage.",
    ],
    termsAndConditions: [
      "All services will be provided as per schedule.",
      "In case of parts replacement, cost will be extra.",
      "Customer must ensure proper power supply and access during service.",
      "Contract is non-transferable and valid for one year from start date.",
    ]
  });

  // --- TEMPLATE DEFINITIONS (For Modal List) ---
  const templatesList = [
    {
      id: 1,
      name: "Classic Navy & Gold",
      description: "Elegant layout with gold accents, double border structure, and traditional circular AC seal.",
      accent: "text-amber-500",
      tag: "Traditional Premium"
    },
    {
      id: 2,
      name: "Modern Sky Blue",
      description: "Clean corporate tech layout featuring solid light blue metadata bars, clear columns, and modern headers.",
      accent: "text-sky-500",
      tag: "Tech Professional"
    },
    {
      id: 3,
      name: "Royal Emerald Executive",
      description: "Sophisticated green theme with rounded border badges, alternating card tables, and compact detail frames.",
      accent: "text-emerald-500",
      tag: "Corporate High-End"
    },
    {
      id: 4,
      name: "Slate Minimalist Pro",
      description: "Sleek slate-gray design focusing on flawless whitespace, modern thin lines, and minimalist weight layouts.",
      accent: "text-slate-400",
      tag: "Modern Studio"
    },
    {
      id: 5,
      name: "Crimson Sunset Dynamic",
      description: "Warm crimson-orange gradient header blocks, distinct left sidebar segments, and high contrast breakdowns.",
      accent: "text-orange-500",
      tag: "Dynamic Energetic"
    }
  ];

  // --- DATA HANDLERS ---
  const handleInvoiceItemChange = (index, field, value) => {
    const updated = [...invoiceData.items];
    updated[index][field] =
      field === "qty" || field === "price"
        ? value === "" ? "" : Number(value)
        : value;
    setInvoiceData({ ...invoiceData, items: updated });
  };

  const addInvoiceItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { name: "", hsn: "", qty: "", price: "" }],
    });
  };

  const removeInvoiceItem = (index) => {
    const updated = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: updated });
  };

  const calculateSubTotal = () =>
    invoiceData.items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0);

  const calculateTotalQty = () =>
    invoiceData.items.reduce((sum, item) => sum + Number(item.qty || 0), 0);

  const subTotalAmount = calculateSubTotal();
  const balanceAmount = subTotalAmount - Number(invoiceData.receivedAmount || 0);

  // Number to words converter
  const numberToWords = (num) => {
    if (num === 0) return "Zero Rupees Only";
    const a = [
      "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
      "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
    ];
    const b = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];
    const g = ["", "Thousand", "Lakh", "Crore"];
    let count = 0;
    let str = "";
    
    const parse = (n) => {
      let temp = "";
      if (n > 19) {
        temp += b[Math.floor(n / 10)] + " " + a[n % 10];
      } else {
        temp += a[n];
      }
      return temp;
    };
    
    let n = num;
    while (n > 0) {
      let rem = n % 100;
      if (count === 1) rem = n % 10;
      if (count === 1 && n % 100 > 0) {
        let doubleDigit = n % 100;
        let tStr =
          doubleDigit > 19
            ? b[Math.floor(doubleDigit / 10)] + " " + a[doubleDigit % 10]
            : a[doubleDigit];
        str = tStr + " " + g[count] + " " + str;
        n = Math.floor(n / 100);
        count += 2;
        continue;
      }
      if (rem > 0) {
        str = parse(rem) + " " + g[count] + " " + str;
      }
      if (count === 0) {
        n = Math.floor(n / 100);
        count++;
      } else {
        n = Math.floor(n / 100);
        count++;
      }
    }
    return str.trim() + " Rupees Only";
  };

  // --- DOWNLOAD PDF FUNCTION ---
  const downloadPDF = async () => {
    const element = pdfRef.current;
    const originalTransform = element.style.transform;
    const originalTransformOrigin = element.style.transformOrigin;
    
    element.style.transform = "none";
    element.style.transformOrigin = "unset";

    try {
      const canvas = await html2canvas(element, {
        scale: 2.2, // Crisp density
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, "", "FAST");
      
      const selectedTheme = (templatesList.find(t => t.id === activeTemplate)?.name || "Theme").replace(/\s+/g, "_");
      const documentName = activeTab === "invoice" 
        ? `Invoice_${(invoiceData.invoiceNo || "Draft").trim()}_${selectedTheme}`
        : `AMC_${(amcData.clientName || "Contract").trim().replace(/\s+/g, "_")}_${selectedTheme}`;
      
      pdf.save(`${documentName}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF download failed: " + error.message);
    } finally {
      element.style.transform = `scale(${zoom * mobileScale})`;
      element.style.transformOrigin = "top center";
    }
  };

  // --- NATIVE MOBILE SHARING FUNCTION ---
  const sharePDF = async () => {
    const element = pdfRef.current;
    const originalTransform = element.style.transform;
    const originalTransformOrigin = element.style.transformOrigin;
    
    element.style.transform = "none";
    element.style.transformOrigin = "unset";

    try {
      const canvas = await html2canvas(element, {
        scale: 2.2, // Crisp density
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, "", "FAST");
      
      const selectedTheme = (templatesList.find(t => t.id === activeTemplate)?.name || "Theme").replace(/\s+/g, "_");
      const documentName = activeTab === "invoice" 
        ? `Invoice_${(invoiceData.invoiceNo || "Draft").trim()}_${selectedTheme}`
        : `AMC_${(amcData.clientName || "Contract").trim().replace(/\s+/g, "_")}_${selectedTheme}`;
      
      const pdfBlob = pdf.output("blob");
      const file = new File([pdfBlob], `${documentName}.pdf`, { type: "application/pdf" });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${documentName}.pdf`,
          text: `Here is your dynamic PDF document from ${shopDetails.name}.`,
        });
      } else {
        // WebView / Insecure context fallback: launch custom full-screen sharing sheet!
        const pdfDataUri = pdf.output("datauristring");
        setShareFallbackData({
          imgData: imgData,
          pdfDataUri: pdfDataUri,
          documentName: `${documentName}.pdf`,
          rawPdf: pdf
        });
      }
    } catch (error) {
      console.error("PDF sharing failed:", error);
      alert("PDF sharing failed: " + error.message);
    } finally {
      element.style.transform = `scale(${zoom * mobileScale})`;
      element.style.transformOrigin = "top center";
    }
  };

  const handleInvoiceDescChange = (index, value) => {
    const updated = [...invoiceData.descriptionList];
    updated[index] = value;
    setInvoiceData({ ...invoiceData, descriptionList: updated });
  };

  const addInvoiceDesc = () => {
    setInvoiceData({
      ...invoiceData,
      descriptionList: [...invoiceData.descriptionList, ""]
    });
  };

  const removeInvoiceDesc = (index) => {
    const updated = invoiceData.descriptionList.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, descriptionList: updated });
  };

  // Dynamic Theme Styling Classes for A4 Document
  const getThemeStyles = () => {
    switch (activeTemplate) {
      case 1: // Navy/Gold
        return {
          primaryText: "text-slate-900",
          border: "border-slate-800",
          borderSec: "border-slate-300",
          accentText: "text-amber-600",
          accentBg: "bg-slate-900",
          accentLightBg: "bg-amber-50/50",
          tableHeadBg: "bg-slate-900 text-white",
          logoBorder: "border-slate-800",
          titleBorder: "border-slate-700/80",
          goldTrim: "border-2 border-amber-600/80 p-3 h-full rounded-sm"
        };
      case 2: // Sky Blue
        return {
          primaryText: "text-slate-900",
          border: "border-sky-500",
          borderSec: "border-slate-200",
          accentText: "text-sky-600",
          accentBg: "bg-sky-600",
          accentLightBg: "bg-sky-50",
          tableHeadBg: "bg-sky-100 text-sky-950 font-black",
          logoBorder: "border-sky-500",
          titleBorder: "border-sky-200",
          goldTrim: "h-full"
        };
      case 3: // Emerald
        return {
          primaryText: "text-slate-900",
          border: "border-emerald-700",
          borderSec: "border-slate-200",
          accentText: "text-emerald-700",
          accentBg: "bg-emerald-700",
          accentLightBg: "bg-emerald-50/50",
          tableHeadBg: "bg-emerald-700 text-white font-bold",
          logoBorder: "border-emerald-700",
          titleBorder: "border-emerald-300",
          goldTrim: "h-full"
        };
      case 4: // Slate Minimalist
        return {
          primaryText: "text-slate-900",
          border: "border-slate-800",
          borderSec: "border-slate-200",
          accentText: "text-slate-700",
          accentBg: "bg-slate-800",
          accentLightBg: "bg-slate-50",
          tableHeadBg: "bg-slate-100 text-slate-800 font-bold",
          logoBorder: "border-slate-800",
          titleBorder: "border-slate-300",
          goldTrim: "h-full"
        };
      case 5: // Crimson Sunset
        return {
          primaryText: "text-slate-900",
          border: "border-rose-600",
          borderSec: "border-slate-200",
          accentText: "text-rose-600",
          accentBg: "bg-gradient-to-r from-rose-700 to-orange-600",
          accentLightBg: "bg-rose-50/50",
          tableHeadBg: "bg-gradient-to-r from-rose-700 to-orange-600 text-white font-bold",
          logoBorder: "border-rose-600",
          titleBorder: "border-rose-200",
          goldTrim: "h-full"
        };
      default:
        return {};
    }
  };

  const st = getThemeStyles();

  // A4 Aprox base Height in px is 1123. Calculate dynamic container viewport height to prevent empty space.
  const dynamicContainerHeight = 1123 * zoom * mobileScale;

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      
      {/* ========================================================
          🚀 TOP PREMIUM HEADER (FULLY RESPONSIVE)
          ======================================================== */}
      <header className={`sticky top-0 z-40 px-3 py-3 md:px-6 md:py-4 border-b transition-all duration-300 ${theme === "dark" ? "bg-slate-900/80 border-slate-800/80 glass-panel" : "bg-white/80 border-slate-200/80 glass-panel-light"} shadow-md`}>
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          
          {/* Logo Group */}
          <div className="flex items-center gap-3 select-none w-full sm:w-auto">
            <div className="relative group shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-slate-900 p-2 rounded-xl text-blue-400 shadow-xl flex items-center justify-center">
                <Award className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className={`text-lg md:text-2xl font-black tracking-tight ${theme === "dark" ? "text-white" : "text-slate-900"}`}>
                  {shopDetails.name}
                </h1>
                <span className="text-[8px] md:text-[10px] bg-blue-500/10 text-blue-400 font-extrabold px-1.5 py-0.5 rounded border border-blue-500/20 uppercase tracking-widest leading-none">
                  Suite
                </span>
              </div>
              <p className="text-[9px] md:text-[11px] text-slate-400 font-medium tracking-wide">
                Air Conditioner Service & Repairs Engine
              </p>
            </div>
          </div>

          {/* Theme & Actions Tab Bar */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-850">
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-550 text-white text-[10px] md:text-xs font-black px-3.5 py-2 rounded-xl shadow-lg shadow-blue-500/10 transition active:scale-95 cursor-pointer animate-pulse"
              >
                <Download size={12} /> Install App
              </button>
            )}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-xl border transition-all active:scale-90 ${theme === "dark" ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700" : "bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200"}`}
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {viewState === "form" && (
              <div className={`flex p-0.5 rounded-xl border ${theme === "dark" ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200"}`}>
                <button
                  onClick={() => setActiveTab("invoice")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${activeTab === "invoice" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-155"}`}
                >
                  <FileText size={12} /> Tax Invoice
                </button>
                <button
                  onClick={() => setActiveTab("amc")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all ${activeTab === "amc" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-155"}`}
                >
                  <ClipboardList size={12} /> AMC Contract
                </button>
              </div>
            )}
            
            {viewState === "preview" && (
              <button
                onClick={() => setViewState("form")}
                className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl transition border border-slate-700 cursor-pointer"
              >
                <ArrowLeft size={12} /> Back to Editor
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          FLOW 1: FULL SCREEN DYNAMIC INPUT FORM STATE (MOBILE SECURE)
          ======================================================== */}
      {viewState === "form" && (
        <main className="flex-grow max-w-[850px] w-full mx-auto p-3 sm:p-4 lg:p-8 animate-slide-in">
          <div className={`p-4 sm:p-6 rounded-3xl border shadow-2xl space-y-6 sm:space-y-8 ${theme === "dark" ? "bg-slate-900/60 border-slate-800/80 glass-panel" : "bg-white border-slate-200"}`}>
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800/40 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-blue-500 flex items-center gap-2">
                  <Sparkles size={18} /> Document Fields Generator
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Fill in the fields to configure the document preview</p>
              </div>
              <span className="self-start sm:self-auto text-[9px] bg-slate-800 text-slate-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {activeTab === "invoice" ? "Invoice Mode" : "AMC Mode"}
              </span>
            </div>

            {/* Active company profile layout details */}
            <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-3.5 space-y-2">
              <span className="text-[9px] bg-blue-500/10 text-blue-400 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                Active Brand Profile
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div>
                  <p className="text-slate-400">Shop Name:</p>
                  <p className={`font-black ${theme === "dark" ? "text-white" : "text-slate-800"}`}>{shopDetails.name}</p>
                </div>
                <div>
                  <p className="text-slate-400">Mobile & Email:</p>
                  <p className="font-bold text-slate-350">{shopDetails.mobile} | {shopDetails.email}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-slate-400">Address:</p>
                  <p className="text-slate-300 font-medium leading-relaxed">{shopDetails.address}</p>
                </div>
              </div>
            </div>

            {activeTab === "invoice" ? (
              /* ==========================================
                 INVOICE INPUT FORM FIELDS
                 ========================================== */
              <div className="space-y-6">
                
                {/* 1. Details of the bill */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-blue-500 pl-2">1. Document Identifiers</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Invoice No</label>
                      <input
                        type="text"
                        value={invoiceData.invoiceNo}
                        onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNo: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Date</label>
                      <input
                        type="date"
                        value={invoiceData.date}
                        onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Warranty Period</label>
                      <input
                        type="text"
                        value={invoiceData.warrantyPeriod}
                        onChange={(e) => setInvoiceData({ ...invoiceData, warrantyPeriod: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Client Profile */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-blue-500 pl-2">2. Customer Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={invoiceData.clientName}
                        onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Customer Mobile</label>
                      <input
                        type="text"
                        value={invoiceData.clientMobile}
                        onChange={(e) => setInvoiceData({ ...invoiceData, clientMobile: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Client Address</label>
                      <input
                        type="text"
                        value={invoiceData.clientAddress}
                        onChange={(e) => setInvoiceData({ ...invoiceData, clientAddress: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Place of Supply (State)</label>
                      <input
                        type="text"
                        value={invoiceData.clientState}
                        onChange={(e) => setInvoiceData({ ...invoiceData, clientState: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Dynamic service items list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-blue-500 pl-2">3. Service & Parts Inventory</h3>
                    <button
                      onClick={addInvoiceItem}
                      className="text-[10px] bg-blue-600/10 hover:bg-blue-600 border border-blue-500/30 text-blue-400 hover:text-white px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                    >
                      <Plus size={12} /> Add New Line
                    </button>
                  </div>

                  {invoiceData.items.map((item, idx) => (
                    <div key={idx} className="bg-slate-950/30 p-3 sm:p-4 rounded-2xl border border-slate-800 space-y-3 relative">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500">Service Row #{idx+1}</span>
                        {invoiceData.items.length > 1 && (
                          <button
                            onClick={() => removeInvoiceItem(idx)}
                            className="text-rose-450 hover:text-rose-600 transition p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      
                      <textarea
                        placeholder="Enter details of AC dynamic repairing, model, split, inverter services..."
                        value={item.name}
                        onChange={(e) => handleInvoiceItemChange(idx, "name", e.target.value)}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-2.5 text-xs text-white min-h-[50px] max-h-[120px] outline-none focus:border-blue-500"
                      />
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">HSN/SAC</label>
                          <input
                            type="text"
                            placeholder="HSN"
                            value={item.hsn}
                            onChange={(e) => handleInvoiceItemChange(idx, "hsn", e.target.value)}
                            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-2 text-xs text-white text-center focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">Quantity</label>
                          <input
                            type="number"
                            placeholder="Qty"
                            value={item.qty}
                            onChange={(e) => handleInvoiceItemChange(idx, "qty", e.target.value)}
                            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-2 text-xs text-white text-center focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] font-bold text-slate-500 uppercase mb-0.5">Rate (₹)</label>
                          <input
                            type="number"
                            placeholder="Price"
                            value={item.price}
                            onChange={(e) => handleInvoiceItemChange(idx, "price", e.target.value)}
                            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-2 text-xs text-white text-center focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. Payment channels & banking */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-blue-500 pl-2">4. Payment & Banking</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Paid Amount (₹)</label>
                      <input
                        type="number"
                        value={invoiceData.receivedAmount}
                        onChange={(e) => setInvoiceData({ ...invoiceData, receivedAmount: Number(e.target.value) })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Payment Notes (e.g. Paid/Pending)</label>
                      <input
                        type="text"
                        value={invoiceData.notes}
                        onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Bank Name & Branch</label>
                      <input
                        type="text"
                        value={invoiceData.bankName}
                        onChange={(e) => setInvoiceData({ ...invoiceData, bankName: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Account Holder</label>
                      <input
                        type="text"
                        value={invoiceData.accountName}
                        onChange={(e) => setInvoiceData({ ...invoiceData, accountName: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Account Number</label>
                      <input
                        type="text"
                        value={invoiceData.accountNo}
                        onChange={(e) => setInvoiceData({ ...invoiceData, accountNo: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">IFSC Code</label>
                      <input
                        type="text"
                        value={invoiceData.ifscCode}
                        onChange={(e) => setInvoiceData({ ...invoiceData, ifscCode: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Terms / Description clauses */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-blue-500 pl-2">5. Corporate Terms & Clauses</h3>
                    <button
                      onClick={addInvoiceDesc}
                      className="text-[9px] bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white px-2.5 py-1 rounded border border-indigo-500/25 flex items-center gap-1 transition cursor-pointer"
                    >
                      <Plus size={10} /> Add Point
                    </button>
                  </div>
                  {invoiceData.descriptionList.map((desc, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <span className="text-[10px] font-bold text-slate-500 w-5 text-center">{idx+1}.</span>
                      <input
                        type="text"
                        value={desc}
                        onChange={(e) => handleInvoiceDescChange(idx, e.target.value)}
                        className="flex-1 bg-slate-950/40 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:border-blue-500 outline-none"
                      />
                      <button onClick={() => removeInvoiceDesc(idx)} className="text-rose-450 hover:text-rose-600 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              /* ==========================================
                 AMC CONTRACT INPUT FORM FIELDS
                 ========================================== */
              <div className="space-y-6">
                
                {/* 1. Client profile */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-blue-500 pl-2">1. Customer details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Customer Name</label>
                      <input
                        type="text"
                        value={amcData.clientName}
                        onChange={(e) => setAmcData({ ...amcData, clientName: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Mobile</label>
                      <input
                        type="text"
                        value={amcData.mobile}
                        onChange={(e) => setAmcData({ ...amcData, mobile: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Customer Address</label>
                      <input
                        type="text"
                        value={amcData.address}
                        onChange={(e) => setAmcData({ ...amcData, address: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Email</label>
                      <input
                        type="text"
                        value={amcData.email}
                        onChange={(e) => setAmcData({ ...amcData, email: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Machinery spec details */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-blue-500 pl-2">2. AC details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">AC Brand</label>
                      <input
                        type="text"
                        value={amcData.brand}
                        onChange={(e) => setAmcData({ ...amcData, brand: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Model No.</label>
                      <input
                        type="text"
                        value={amcData.model}
                        onChange={(e) => setAmcData({ ...amcData, model: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Capacity Index (Ton)</label>
                      <input
                        type="text"
                        value={amcData.capacity}
                        onChange={(e) => setAmcData({ ...amcData, capacity: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Type (Split/Window)</label>
                      <input
                        type="text"
                        value={amcData.type}
                        onChange={(e) => setAmcData({ ...amcData, type: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">AC Quantity</label>
                      <input
                        type="number"
                        value={amcData.qty}
                        onChange={(e) => setAmcData({ ...amcData, qty: Number(e.target.value) })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white text-center focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Duration & Payment */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-blue-500 pl-2">3. Validity & Payment</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Agreement From</label>
                      <input
                        type="date"
                        value={amcData.fromDate}
                        onChange={(e) => setAmcData({ ...amcData, fromDate: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Agreement To</label>
                      <input
                        type="date"
                        value={amcData.toDate}
                        onChange={(e) => setAmcData({ ...amcData, toDate: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Total Contract Value (₹)</label>
                      <input
                        type="number"
                        value={amcData.totalAmount}
                        onChange={(e) => setAmcData({ ...amcData, totalAmount: Number(e.target.value) })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Payment Mode</label>
                      <input
                        type="text"
                        value={amcData.paymentMode}
                        onChange={(e) => setAmcData({ ...amcData, paymentMode: e.target.value })}
                        className="w-full bg-slate-950/40 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 4. HUGE GENERATE BUTTON */}
            <div className="pt-4 border-t border-slate-800/40">
              <button
                onClick={() => setViewState("preview")}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs sm:text-sm tracking-widest uppercase transition-all shadow-xl hover:shadow-blue-500/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye size={18} /> Generate Document Live Preview
              </button>
            </div>

          </div>
        </main>
      )}

      {/* ========================================================
          FLOW 2: FULL SCREEN A4 PREVIEW WORKSPACE (RESPONSIVE VIEWPORT BOUND)
          ======================================================== */}
      {viewState === "preview" && (
        <main className="flex-grow max-w-[1400px] w-full mx-auto p-3 sm:p-4 lg:p-6 flex flex-col items-center animate-slide-in relative">
          
          {/* Dynamic Document Controls Card */}
          <div className={`w-full max-w-[210mm] flex flex-col sm:flex-row items-center justify-between gap-4 p-3.5 mb-4 rounded-2xl border transition-all ${theme === "dark" ? "bg-slate-900/60 border-slate-800 glass-panel" : "bg-white border-slate-200 shadow-md"}`}>
            
            {/* Template Selector Button */}
            <button
              onClick={() => setShowTemplateModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] sm:text-xs font-black px-4 py-2.5 rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
            >
              <Layers size={14} /> PDF Templates ({activeTemplate}/5)
            </button>

            {/* Center aligned: Zoom Controls (Hidden on ultra-small mobile screens to save space since auto-scale is active) */}
            <div className="hidden xs:flex items-center gap-3">
              <button 
                onClick={() => setZoom(Math.max(0.4, zoom - 0.05))} 
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800/35 border border-slate-700/35 rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-300 w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button 
                onClick={() => setZoom(Math.min(1.5, zoom + 0.05))} 
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800/35 border border-slate-700/35 rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
              <button 
                onClick={() => setZoom(0.85)} 
                className="text-[9px] font-bold text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50"
              >
                Reset
              </button>
            </div>

            {/* Right aligned: Print, Share & Save buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap sm:flex-nowrap">
              <button
                onClick={() => setViewState("form")}
                className="text-[10px] sm:text-xs font-bold bg-slate-800 hover:bg-slate-750 text-slate-300 px-3.5 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={sharePDF}
                className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] sm:text-xs font-black px-4.5 py-2.5 rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Share2 size={13} /> Share PDF
              </button>
              <button
                onClick={downloadPDF}
                className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-[10px] sm:text-xs font-black px-4.5 py-2.5 rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Download size={13} /> Save PDF
              </button>
            </div>

          </div>

          {/* Master Scaling Workspace Frame - Responsive viewport fit */}
          <div 
            className="flex justify-center bg-slate-950/80 rounded-3xl border border-slate-900 shadow-inner overflow-hidden relative mx-auto"
            style={{ 
              width: `${794 * zoom * mobileScale}px`,
              height: `${1123 * zoom * mobileScale}px` 
            }}
          >
            
            {/* A4 Sheet block */}
            <div 
              ref={pdfRef}
              id="rep-wallah-a4-sheet"
              className="w-[794px] h-[1123px] bg-white text-slate-800 p-[12mm] shadow-2xl absolute"
              style={{ 
                boxSizing: "border-box", 
                transform: `scale(${zoom * mobileScale})`, 
                transformOrigin: "top center",
                left: "50%",
                marginLeft: "-397px", // center the absolute A4 sheet!
                top: 0
              }}
            >
              
              {activeTab === "invoice" ? (
                
                /* ========================================================
                   UNIVERSAL INVOICE TEMPLATE ENGINE (1 OF 5 THEMES)
                   ======================================================== */
                <div className={`flex-grow flex flex-col justify-between ${st.goldTrim}`}>
                  <div>
                    {/* Header bar or design line based on theme style */}
                    {activeTemplate === 1 && (
                      <div className="text-center mb-2">
                        <h2 className="text-2xl font-black tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 uppercase">
                          Tax Invoice
                        </h2>
                      </div>
                    )}
                    
                    {activeTemplate === 5 && (
                      <div className="h-2 bg-gradient-to-r from-rose-700 to-orange-500 rounded-full mb-3" />
                    )}

                    {/* Elite Header Segment */}
                    <div className={`grid grid-cols-12 border-b pb-3 mb-3 items-start ${st.titleBorder}`}>
                      
                      {/* Left: Dynamic Brand details (Strictly bound details) */}
                      <div className="col-span-8 flex items-start gap-3">
                        <div className={`w-14 h-14 border rounded-full flex flex-col items-center justify-center shrink-0 ${st.logoBorder} ${activeTemplate === 1 ? "bg-slate-900 text-amber-500" : activeTemplate === 2 ? "bg-sky-50 text-sky-800" : activeTemplate === 3 ? "bg-emerald-50 text-emerald-800" : activeTemplate === 4 ? "bg-slate-100 text-slate-800" : "bg-rose-50 text-rose-800"}`}>
                          <Award size={22} />
                          <span className="text-[5.5px] font-black uppercase tracking-widest leading-none mt-0.5">ESTD</span>
                        </div>
                        <div>
                          <h2 className={`text-xl font-black leading-none uppercase tracking-tight ${activeTemplate === 1 ? "text-slate-950" : activeTemplate === 2 ? "text-sky-800" : activeTemplate === 3 ? "text-emerald-800" : activeTemplate === 4 ? "text-slate-900" : "text-rose-700"}`}>
                            {shopDetails.name}
                          </h2>
                          <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5 tracking-tight">{shopDetails.tagline}</p>
                          <p className="text-[8.5px] font-semibold text-slate-700 max-w-md mt-1 leading-snug">
                            {shopDetails.address}
                          </p>
                          <p className="text-[8.5px] font-extrabold text-slate-900 mt-1">
                            Mobile: {shopDetails.mobile} | Email: {shopDetails.email}
                          </p>
                        </div>
                      </div>

                      {/* Right: Bill of supply / Tax invoice meta card */}
                      <div className="col-span-4 text-right">
                        <h3 className={`text-xs font-black tracking-widest mb-2 uppercase ${st.accentText}`}>
                          {activeTemplate === 2 ? "BILL OF SUPPLY" : "TAX INVOICE"}
                        </h3>
                        <table className="w-full text-[8.5px] border-collapse text-right">
                          <tbody>
                            <tr>
                              <td className="text-slate-400 font-semibold pr-2">Invoice No:</td>
                              <td className="font-mono font-black text-slate-900">{invoiceData.invoiceNo}</td>
                            </tr>
                            <tr>
                              <td className="text-slate-400 font-semibold pr-2">Date:</td>
                              <td className="font-bold text-slate-900">{invoiceData.date}</td>
                            </tr>
                            <tr>
                              <td className="text-slate-400 font-semibold pr-2">Warranty:</td>
                              <td className="font-bold text-slate-900">{invoiceData.warrantyPeriod}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                    </div>

                    {/* Customer Row */}
                    <div className="mb-3">
                      <div className={`text-[8.5px] px-2.5 py-1 font-black uppercase tracking-wider rounded-t ${activeTemplate === 1 ? "bg-slate-900 text-amber-500" : activeTemplate === 2 ? "bg-sky-100 text-sky-950" : activeTemplate === 3 ? "bg-emerald-850 text-white" : activeTemplate === 4 ? "bg-slate-800 text-white" : "bg-gradient-to-r from-rose-700 to-orange-600 text-white"}`}>
                        BILL TO / PLACE OF SUPPLY
                      </div>
                      <div className={`border-x border-b p-2 text-[8.5px] text-slate-700 rounded-b ${st.borderSec} ${activeTemplate === 4 ? "bg-slate-50/50" : ""}`}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-black text-[10px] text-slate-950">{invoiceData.clientName}</p>
                            <p className="text-slate-500 mt-0.5 leading-snug font-medium">{invoiceData.clientAddress}</p>
                          </div>
                          <div className="text-right space-y-0.5 font-semibold text-slate-700">
                            <p>Mobile: {invoiceData.clientMobile}</p>
                            <p>State: {invoiceData.clientState}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services Items Table */}
                    <table className="w-full text-[8.5px] border-collapse border border-slate-200">
                      <thead>
                        <tr className={`${st.tableHeadBg} uppercase text-left`}>
                          <th className="p-1.5 w-8 text-center">S.N.</th>
                          <th className="p-1.5">SERVICE DESCRIPTION</th>
                          <th className="p-1.5 w-16 text-center">HSN/SAC</th>
                          <th className="p-1.5 w-14 text-center">QTY</th>
                          <th className="p-1.5 w-20 text-right">RATE</th>
                          <th className="p-1.5 w-24 text-right">AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.items.map((item, idx) => (
                          <tr key={idx} className={`border-b font-medium ${st.borderSec} ${idx % 2 === 1 && activeTemplate === 3 ? "bg-emerald-50/20" : ""}`}>
                            <td className="p-2 text-center text-slate-400 font-mono">{idx + 1}</td>
                            <td className="p-2 text-slate-950 font-bold leading-tight">{item.name || "Repairing/Maintenance Services"}</td>
                            <td className="p-2 text-center font-mono text-slate-500">{item.hsn || "-"}</td>
                            <td className="p-2 text-center font-bold">{item.qty} PCS</td>
                            <td className="p-2 text-right font-mono">₹{item.price.toFixed(2)}</td>
                            <td className="p-2 text-right font-mono font-black text-slate-950">₹{(item.qty * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                        
                        {/* Subtotal row */}
                        <tr className={`font-black ${activeTemplate === 1 ? "bg-slate-50 text-slate-950" : activeTemplate === 2 ? "bg-sky-50 text-sky-950" : activeTemplate === 3 ? "bg-emerald-50 text-emerald-950" : activeTemplate === 4 ? "bg-slate-50 text-slate-950" : "bg-rose-50 text-rose-955"}`}>
                          <td className="p-1.5 text-center"></td>
                          <td className="p-1.5 uppercase tracking-wide">SUBTOTAL</td>
                          <td className="p-1.5 text-center"></td>
                          <td className="p-1.5 text-center font-mono">{calculateTotalQty()}</td>
                          <td className="p-1.5 text-right"></td>
                          <td className="p-1.5 text-right font-mono">₹{subTotalAmount.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Terms & Balance blocks */}
                    <div className="grid grid-cols-12 gap-4 mt-3 items-start">
                      
                      {/* Left: Notes, Terms, Bank details */}
                      <div className="col-span-7 space-y-2">
                        
                        <div className="text-[8px] text-slate-700">
                          <span className="font-black text-slate-950 uppercase block">NOTES / RECORD</span>
                          <p className="font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5">{invoiceData.notes}</p>
                        </div>

                        <div className="text-[8px] text-slate-700 leading-tight">
                          <span className="font-black text-slate-950 uppercase block">DESCRIPTION & TERMS</span>
                          <ol className="list-decimal pl-3 space-y-0.5 text-slate-500 font-medium">
                            {invoiceData.descriptionList.slice(0, 4).map((desc, idx) => (
                              <li key={idx}>{desc}</li>
                            ))}
                          </ol>
                        </div>

                        {/* Bank particulars */}
                        <div className={`border rounded p-2 text-[7.5px] text-slate-700 bg-slate-50/60 ${st.borderSec}`}>
                          <h4 className={`font-black uppercase mb-1 ${st.accentText}`}>BANK REMITTANCE DETAILS</h4>
                          <table className="w-full text-left">
                            <tbody>
                              <tr><td className="font-bold text-slate-400">Account Name:</td><td className="font-black text-slate-950">{invoiceData.accountName}</td></tr>
                              <tr><td className="font-bold text-slate-400">Bank Name:</td><td className="font-bold text-slate-800">{invoiceData.bankName}</td></tr>
                              <tr><td className="font-bold text-slate-400">Account No:</td><td className="font-mono font-black text-slate-950">{invoiceData.accountNo}</td></tr>
                              <tr><td className="font-bold text-slate-400">IFSC Code:</td><td className="font-mono font-black text-blue-900">{invoiceData.ifscCode}</td></tr>
                            </tbody>
                          </table>
                        </div>

                      </div>

                      {/* Right: Balance mathematics & Signature */}
                      <div className="col-span-5 space-y-3 font-sans text-[8.5px] text-right">
                        <table className="w-full border-collapse text-right">
                          <tbody>
                            <tr>
                              <td className="text-slate-400 font-bold pr-2 py-0.5">TAXABLE VALUE</td>
                              <td className="font-mono font-bold py-0.5 text-slate-800">₹{subTotalAmount.toFixed(2)}</td>
                            </tr>
                            <tr className={`border-t font-black text-slate-950 text-[9.5px] ${st.borderSec}`}>
                              <td className="pr-2 py-1">GRAND TOTAL</td>
                              <td className="font-mono py-1">₹{subTotalAmount.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td className="text-slate-400 font-bold pr-2 py-0.5">AMOUNT RECEIVED</td>
                              <td className="font-mono font-bold py-0.5 text-emerald-700">₹{invoiceData.receivedAmount.toFixed(2)}</td>
                            </tr>
                            <tr className={`border-t border-dashed font-black text-slate-950 ${st.borderSec}`}>
                              <td className="pr-2 py-0.5">BALANCE DUE</td>
                              <td className="font-mono py-0.5 text-rose-700">₹{balanceAmount.toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>

                        <div className="bg-slate-50 p-1.5 border border-slate-200 rounded text-right text-[7.5px]">
                          <span className="font-bold text-slate-400 block uppercase text-[6.5px]">Invoice value in words</span>
                          <span className="font-bold text-slate-950 capitalize italic">{numberToWords(subTotalAmount)}</span>
                        </div>

                        {/* Seal Signature */}
                        <div className="pt-2 flex flex-col items-end">
                          <span className="font-signature text-2xl text-blue-955 font-bold pr-4">
                            {shopDetails.authSignatory}
                          </span>
                          <div className="w-28 border-b border-slate-400 my-0.5"></div>
                          <span className="text-[7px] font-black text-slate-800 uppercase tracking-wide">
                            Authorised Signature for
                          </span>
                          <span className={`text-[7.5px] font-black uppercase ${st.accentText}`}>
                            {shopDetails.name}
                          </span>
                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="flex justify-between items-center text-[7px] text-slate-400 pt-2 border-t border-slate-105">
                    <p>Subject to Mumbai jurisdiction</p>
                    <p>Powered by {shopDetails.name} Workspace Suite</p>
                  </div>
                </div>

              ) : (
                
                /* ========================================================
                   UNIVERSAL AMC CONTRACT TEMPLATE ENGINE (1 OF 5 THEMES)
                   ======================================================== */
                <div className={`flex-grow flex flex-col justify-between ${st.goldTrim}`}>
                  <div>
                    {/* Header bar or design line based on theme style */}
                    {activeTemplate === 5 && (
                      <div className="h-2 bg-gradient-to-r from-rose-700 to-orange-500 rounded-full mb-3" />
                    )}

                    {/* Elite Header Segment */}
                    <div className={`grid grid-cols-12 border-b pb-3 mb-3 items-center ${st.titleBorder}`}>
                      
                      {/* Left: Dynamic Brand details */}
                      <div className="col-span-8 flex items-start gap-3">
                        <div className={`w-14 h-14 border rounded-full flex flex-col items-center justify-center shrink-0 ${st.logoBorder} ${activeTemplate === 1 ? "bg-slate-900 text-amber-500" : activeTemplate === 2 ? "bg-sky-50 text-sky-800" : activeTemplate === 3 ? "bg-emerald-50 text-emerald-800" : activeTemplate === 4 ? "bg-slate-100 text-slate-800" : "bg-rose-50 text-rose-800"}`}>
                          <Award size={22} />
                          <span className="text-[5.5px] font-black uppercase tracking-widest leading-none mt-0.5">AMC</span>
                        </div>
                        <div>
                          <h2 className={`text-xl font-black leading-none uppercase tracking-tight ${activeTemplate === 1 ? "text-slate-950" : activeTemplate === 2 ? "text-sky-800" : activeTemplate === 3 ? "text-emerald-850" : activeTemplate === 4 ? "text-slate-900" : "text-rose-700"}`}>
                            {shopDetails.name}
                          </h2>
                          <p className="text-[8px] font-bold text-slate-500 uppercase mt-0.5 tracking-tight">{shopDetails.tagline}</p>
                          <p className="text-[8.5px] font-semibold text-slate-700 max-w-md mt-1 leading-snug">
                            {shopDetails.address}
                          </p>
                        </div>
                      </div>

                      {/* Right: AMC contract banner */}
                      <div className="col-span-4 text-right">
                        <span className={`inline-block border rounded text-[9px] font-black px-2.5 py-1 uppercase tracking-widest ${activeTemplate === 1 ? "bg-slate-900 text-amber-500 border-amber-600/30" : activeTemplate === 2 ? "bg-sky-100 text-sky-950 border-sky-200" : activeTemplate === 3 ? "bg-emerald-850 text-white border-emerald-700" : activeTemplate === 4 ? "bg-slate-800 text-white border-slate-700" : "bg-gradient-to-r from-rose-700 to-orange-600 text-white border-rose-500"}`}>
                          AMC CONTRACT
                        </span>
                        <p className="text-[8px] text-slate-950 font-bold mt-1.5">Mobile: {shopDetails.mobile}</p>
                      </div>

                    </div>

                    {/* Contract period banner bar */}
                    <div className={`border rounded-lg p-2.5 my-2.5 grid grid-cols-3 text-[9px] text-center ${activeTemplate === 4 ? "bg-slate-50 border-slate-200" : "bg-slate-50 border-slate-100"}`}>
                      <div>
                        <span className="text-slate-400 block text-[7.5px] uppercase font-bold">Agreement From</span>
                        <span className="font-bold text-slate-900">{amcData.fromDate}</span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="text-slate-400 block text-[7.5px] uppercase font-bold">Agreement To</span>
                        <span className="font-bold text-slate-900">{amcData.toDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[7.5px] uppercase font-bold">Total AMC Value</span>
                        <span className={`font-black font-mono ${st.accentText}`}>₹{Number(amcData.totalAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Customer Details Box */}
                    <div className={`border rounded-lg p-3 text-[8.5px] space-y-1 ${st.borderSec}`}>
                      <span className={`font-black uppercase tracking-wider text-[8px] block border-b pb-0.5 ${st.accentText}`}>CUSTOMER DETAILS</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-black text-slate-950 text-[9.5px]">{amcData.clientName}</p>
                          <p className="text-slate-500 mt-0.5 font-medium leading-snug">{amcData.address}</p>
                        </div>
                        <div className="text-right space-y-0.5 font-semibold text-slate-700">
                          <p>Contact: {amcData.mobile}</p>
                          <p>Email: {amcData.email || "-"}</p>
                        </div>
                      </div>
                    </div>

                    {/* AC Machinery specifications details box */}
                    <div className={`border rounded-lg p-3 mt-3 text-[8.5px] ${st.borderSec}`}>
                      <span className={`font-black uppercase tracking-wider text-[8px] block border-b pb-0.5 mb-2 ${st.accentText}`}>MACHINERY SPECIFICATIONS</span>
                      <div className="grid grid-cols-5 gap-1.5 text-center text-[8px]">
                        <div className="bg-slate-50 p-1.5 rounded">
                          <span className="text-slate-400 block text-[6.5px] uppercase font-bold">Brand</span>
                          <span className="font-bold text-slate-950">{amcData.brand}</span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded">
                          <span className="text-slate-400 block text-[6.5px] uppercase font-bold">Model No.</span>
                          <span className="font-mono font-bold text-slate-800">{amcData.model}</span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded">
                          <span className="text-slate-400 block text-[6.5px] uppercase font-bold">Type</span>
                          <span className="font-semibold text-slate-800">{amcData.type}</span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded">
                          <span className="text-slate-400 block text-[6.5px] uppercase font-bold">Capacity</span>
                          <span className="font-bold text-slate-850">{amcData.capacity}</span>
                        </div>
                        <div className={`p-1.5 rounded border ${activeTemplate === 1 ? "bg-amber-50 border-amber-200 text-amber-900" : activeTemplate === 2 ? "bg-sky-50 border-sky-100 text-sky-900" : activeTemplate === 3 ? "bg-emerald-50 border-emerald-100 text-emerald-900" : activeTemplate === 4 ? "bg-slate-100 border-slate-200 text-slate-900" : "bg-rose-50 border-rose-100 text-rose-900"}`}>
                          <span className="text-slate-400 block text-[6.5px] uppercase font-bold">Quantity</span>
                          <span className="font-black">{amcData.qty} Units</span>
                        </div>
                      </div>
                    </div>

                    {/* Services split blocks */}
                    <div className="grid grid-cols-2 gap-3 mt-3 text-[7.5px] leading-relaxed">
                      <div className="border border-emerald-100 bg-emerald-50/20 rounded-lg p-2.5">
                        <span className="text-emerald-800 font-black uppercase tracking-wide block mb-1">✓ Services Covered:</span>
                        <ul className="list-disc pl-3.5 space-y-0.5 text-slate-600 font-medium">
                          {amcData.servicesCovered.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>
                      <div className="border border-rose-100 bg-rose-50/20 rounded-lg p-2.5">
                        <span className="text-rose-800 font-black uppercase tracking-wide block mb-1">✗ Excluded Services:</span>
                        <ul className="list-disc pl-3.5 space-y-0.5 text-slate-600 font-medium">
                          {amcData.servicesNotCovered.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>
                    </div>

                    {/* Terms & Conditions list */}
                    <div className="text-[7.5px] space-y-1 mt-3">
                      <span className="font-black text-slate-955 block uppercase">Terms & Conditions:</span>
                      <ol className="list-decimal pl-3 space-y-0.5 text-slate-500 font-medium leading-normal">
                        {amcData.termsAndConditions.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ol>
                    </div>

                  </div>

                  {/* Dual endorsement signatures */}
                  <div className="mt-6 border-t border-slate-200 pt-4 flex justify-between items-end text-[8px]">
                    <div className="text-center w-36">
                      <div className="h-8 border-b border-slate-300"></div>
                      <span className="text-[7px] text-slate-400 block uppercase mt-1 font-bold">Customer Signature</span>
                    </div>
                    
                    <div className="text-center w-40 bg-slate-50 border border-slate-200 rounded p-1.5">
                      <span className="font-signature text-2xl text-blue-900 block font-semibold leading-none py-1">
                        {shopDetails.authSignatory}
                      </span>
                      <span className="text-[6.5px] font-black text-slate-500 block border-t border-slate-200 pt-1 uppercase">
                        Authorized Signatory for
                      </span>
                      <span className={`text-[7px] font-black uppercase ${st.accentText}`}>
                        {shopDetails.name}
                      </span>
                    </div>
                  </div>

                </div>

              )}

            </div>

          </div>

        </main>
      )}

      {/* ========================================================
          3. IMMERSIVE FULL SCREEN TEMPLATE MODAL WORKSPACE (ROOT LEVEL)
          ======================================================== */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-[950px] bg-slate-900 border border-slate-805 rounded-3xl overflow-hidden shadow-2xl animate-scale-in max-h-[95vh] flex flex-col">
            
            {/* Header */}
            <div className="px-4 py-3 md:px-6 md:py-4 bg-slate-950 border-b border-slate-800/80 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-sm md:text-lg font-black text-white flex items-center gap-2">
                  <Layers className="text-blue-500 w-4 h-4 md:w-5 md:h-5" /> Select Document Template
                </h3>
                <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Real mini-A4 layouts of how your PDF will look</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Templates Selection Grid with Live PDF Mini-Mockups */}
            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 overflow-y-auto custom-scrollbar flex-grow">
              {templatesList.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => {
                    setActiveTemplate(tpl.id);
                    setShowTemplateModal(false);
                  }}
                  className={`relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all cursor-pointer group active:scale-[0.98] ${activeTemplate === tpl.id ? "bg-slate-950 border-blue-500/80 shadow-lg shadow-blue-500/5" : "bg-slate-950/40 border-slate-800 hover:border-slate-700"}`}
                >
                  
                  {/* REAL PDF VISUAL MINI-MOCKUP */}
                  <div className="w-full h-28 bg-white border border-slate-205 rounded-xl overflow-hidden relative p-2 flex flex-col justify-between shadow-inner select-none mb-3">
                    
                    {/* Mockup Top Banner based on theme */}
                    <div className="space-y-1">
                      {tpl.id === 1 && (
                        <div className="border border-slate-800 p-0.5 rounded-xs h-full">
                          <div className="w-full border-b border-slate-800 text-center text-[4.5px] font-black uppercase text-slate-900 tracking-tighter">TAX INVOICE</div>
                          <div className="flex justify-between items-center mt-0.5">
                            <div className="flex items-center gap-0.5">
                              <div className="w-2 h-2 rounded-full bg-slate-950 flex items-center justify-center text-[3.5px] text-amber-500 font-bold font-sans">★</div>
                              <div className="text-[3.5px] font-black scale-90 origin-left text-slate-950">RePaiRingWallaH</div>
                            </div>
                            <div className="w-4 h-1.5 bg-slate-900 rounded-xs"></div>
                          </div>
                        </div>
                      )}

                      {tpl.id === 2 && (
                        <div>
                          <div className="w-full bg-sky-100 p-0.5 rounded-xs flex justify-between items-center text-[4px] text-sky-950 font-black">
                            <span>RePaiRingWallaH</span>
                            <span className="scale-75 text-slate-500">BILL</span>
                          </div>
                          <div className="w-6 h-0.5 bg-sky-200 mt-1 rounded-full"></div>
                        </div>
                      )}

                      {tpl.id === 3 && (
                        <div>
                          <div className="w-full bg-emerald-805 p-0.5 rounded-t-xs text-white text-[3.5px] font-black flex justify-between">
                            <span>RePaiRingWallaH</span>
                            <span className="scale-75">AMC</span>
                          </div>
                          <div className="border-x border-b border-slate-200 p-0.5 bg-emerald-50/10 flex justify-between">
                            <div className="w-5 h-0.5 bg-emerald-700 rounded-full"></div>
                            <div className="w-3 h-0.5 bg-slate-300 rounded-full"></div>
                          </div>
                        </div>
                      )}

                      {tpl.id === 4 && (
                        <div className="border-b border-slate-200 pb-0.5">
                          <div className="text-[5px] font-black text-slate-955 tracking-tighter">RePaiRingWallaH</div>
                          <div className="text-[2.5px] text-slate-400 mt-0.5">MINIMALIST PRO</div>
                          <div className="w-full h-[0.5px] bg-slate-300 mt-0.5"></div>
                        </div>
                      )}

                      {tpl.id === 5 && (
                        <div>
                          <div className="h-0.5 bg-gradient-to-r from-rose-700 to-orange-500 rounded-full mb-0.5" />
                          <div className="flex justify-between items-center">
                            <div className="text-[5px] font-black text-rose-700">RePaiRingWallaH</div>
                            <div className="w-4 h-1.5 bg-orange-100 rounded-xs"></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Mockup Middle Columns represent table rows */}
                    <div className="space-y-1">
                      <div className={`h-1 w-full rounded-xs ${tpl.id === 1 ? "bg-slate-900" : tpl.id === 2 ? "bg-sky-100" : tpl.id === 3 ? "bg-emerald-700" : tpl.id === 4 ? "bg-slate-200" : "bg-gradient-to-r from-rose-600 to-orange-500"}`}></div>
                      <div className="flex justify-between border-b border-slate-100 pb-0.5">
                        <div className="w-10 h-0.5 bg-slate-300 rounded-full"></div>
                        <div className="w-3 h-0.5 bg-slate-800 rounded-full"></div>
                      </div>
                    </div>

                    {/* Mockup Signatures & Bottom */}
                    <div className="flex justify-between items-end pt-0.5 border-t border-slate-100">
                      <div className="w-6 h-1 bg-slate-100 rounded-xs"></div>
                      <div className="flex flex-col items-end">
                        <span className="font-signature text-[7px] text-blue-900 leading-none">Salman</span>
                        <div className="w-6 h-[0.5px] bg-slate-400 mt-0.5"></div>
                      </div>
                    </div>

                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-blue-400 transition">
                        {tpl.name}
                      </h4>
                      {activeTemplate === tpl.id && (
                        <span className="bg-blue-600 text-white p-0.5 rounded-full">
                          <Check size={10} />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-400 leading-snug">
                      {tpl.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/40 mt-3 flex justify-between items-center text-[9px]">
                    <span className="font-extrabold text-slate-500 uppercase tracking-widest">Layout #{tpl.id}</span>
                    <span className={`font-black transition-colors ${activeTemplate === tpl.id ? "text-blue-500" : "text-slate-400 group-hover:text-slate-200"}`}>
                      {activeTemplate === tpl.id ? "Active Selected" : "Use Layout"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800/60 flex justify-end shrink-0">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black rounded-xl transition cursor-pointer"
              >
                Close Selector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================
          FLOW 3: MOBILE SHARING ASSISTANT MODAL (FOR WEBVIEWS & HTTP DEVS)
          ======================================================== */}
      {shareFallbackData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-800/60 flex justify-between items-center bg-slate-950/40">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                  <Sparkles className="text-blue-500 w-4 h-4" /> Share & Save Assistant
                </h3>
                <p className="text-[9px] text-slate-400 mt-0.5">Insecure Connection or WebView Fallback</p>
              </div>
              <button
                onClick={() => setShareFallbackData(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Scrollable Area */}
            <div className="p-5 overflow-y-auto custom-scrollbar flex-grow space-y-5 text-center">
              
              {/* Alert Badge explaining what happened */}
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3 text-[10px] sm:text-xs text-amber-300 leading-relaxed text-left space-y-1">
                <p className="font-bold flex items-center gap-1">
                  ⚠️ Note / Dhyan De:
                </p>
                <p>
                  Aap abhi <strong>HTTP (Local Server)</strong> ya phone ke kisi <strong>in-app browser (jaise WhatsApp/Instagram)</strong> par hain. Browsers security ke liye insecure websites par direct sharing block kar dete hain.
                </p>
              </div>

              {/* Instructions Steps */}
              <div className="text-left space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-2 border-blue-500 pl-2">
                  Follow these steps to share/save:
                </h4>
                
                <div className="space-y-2 text-[11px] text-slate-350">
                  <div className="flex gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 font-extrabold flex items-center justify-center shrink-0">1</span>
                    <p className="leading-snug">
                      <strong>Long-press (daba kar rakhein)</strong> the document preview image below to save it as an image or share it directly to WhatsApp!
                    </p>
                  </div>
                  
                  <div className="flex gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 font-extrabold flex items-center justify-center shrink-0">2</span>
                    <p className="leading-snug">
                      Or click <strong>"Open Direct PDF"</strong> below to view the full PDF in a clean window, where you can natively save/print!
                    </p>
                  </div>
                </div>
              </div>

              {/* High-res Image Preview representing the A4 page */}
              <div className="space-y-1.5">
                <span className="text-[9px] bg-slate-800 text-slate-400 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  Document Preview (Tap & Hold to save)
                </span>
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-white max-w-[280px] mx-auto shadow-lg group relative">
                  <img 
                    src={shareFallbackData.imgData} 
                    alt="Compiled Document Preview"
                    className="w-full h-auto select-none pointer-events-auto"
                  />
                </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="px-5 py-4 bg-slate-950/60 border-t border-slate-800/60 grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  const newWindow = window.open();
                  if (newWindow) {
                    newWindow.document.write(
                      `<iframe src="${shareFallbackData.pdfDataUri}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                    );
                  } else {
                    alert("Pop-up blocker active. Please allow popups for this site or use standard download.");
                  }
                }}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] sm:text-xs font-black rounded-xl transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Open Direct PDF
              </button>
              <button
                onClick={() => {
                  shareFallbackData.rawPdf.save(shareFallbackData.documentName);
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] sm:text-xs font-black rounded-xl transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Download size={12} /> Download PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
