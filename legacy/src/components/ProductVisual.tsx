import React from "react";

interface ProductVisualProps {
  type: "buddha" | "vase" | "aroma" | "planter";
  className?: string;
  badge?: string;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  type,
  className = "",
  badge,
}) => {
  return (
    <div
      className={`relative w-full aspect-[4/3] bg-[#f0ece1] overflow-hidden rounded-xl border border-[#e7e1d6] flex items-center justify-center select-none ${className}`}
    >
      {/* Background Soft Studio Lighting Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#e8e2d4] via-[#f4f0e6] to-[#faf8f2] opacity-90" />

      {/* Travertine Stone Table Horizon */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-[#ded6c4]/60 border-t border-[#d4cbba]/40 backdrop-blur-xs" />

      {/* Subtle Warm Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(180,136,73,0.06)]" />

      {type === "buddha" && (
        <svg
          viewBox="0 0 320 240"
          className="relative z-10 w-4/5 h-4/5 drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="buddhaStone"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#dfd7c8" />
              <stop offset="50%" stopColor="#cfc4b0" />
              <stop offset="100%" stopColor="#a89a84" />
            </linearGradient>
            <linearGradient id="goldAcc" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e4c483" />
              <stop offset="50%" stopColor="#b48849" />
              <stop offset="100%" stopColor="#7a5520" />
            </linearGradient>
            <radialGradient id="haloLight" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Pedestal Shadow */}
          <ellipse
            cx="160"
            cy="208"
            rx="70"
            ry="12"
            fill="#3c372e"
            fillOpacity="0.18"
          />

          {/* Velvet/Wood Pedestal */}
          <rect x="100" y="196" width="120" height="12" rx="3" fill="#2b2823" />
          <rect
            x="95"
            y="202"
            width="130"
            height="5"
            rx="2"
            fill="#b48849"
            fillOpacity="0.8"
          />

          {/* Aura / Halo Glow */}
          <circle cx="160" cy="110" r="75" fill="url(#haloLight)" />

          {/* Torso / Neck base */}
          <path
            d="M125 196 C125 180 135 170 148 165 L172 165 C185 170 195 180 195 196 Z"
            fill="url(#buddhaStone)"
          />

          {/* Head & Facial Planes */}
          <path
            d="M160 55 C125 55 120 90 120 125 C120 155 138 172 160 172 C182 172 200 155 200 125 C200 90 195 55 160 55 Z"
            fill="url(#buddhaStone)"
          />

          {/* Ushnisha (Topknot) */}
          <circle cx="160" cy="48" r="14" fill="url(#buddhaStone)" />
          <circle cx="160" cy="42" r="5" fill="url(#goldAcc)" />

          {/* Hair curls / texture */}
          <circle cx="145" cy="58" r="4" fill="#a89a84" />
          <circle cx="155" cy="54" r="4" fill="#a89a84" />
          <circle cx="165" cy="54" r="4" fill="#a89a84" />
          <circle cx="175" cy="58" r="4" fill="#a89a84" />
          <circle cx="150" cy="64" r="3.5" fill="#a89a84" />
          <circle cx="160" cy="62" r="3.5" fill="#a89a84" />
          <circle cx="170" cy="64" r="3.5" fill="#a89a84" />

          {/* Elongated Ear Lobes */}
          <path
            d="M118 105 C114 115 113 135 116 142 C118 145 120 142 121 138 Z"
            fill="#b9ac95"
          />
          <path
            d="M202 105 C206 115 207 135 204 142 C202 145 200 142 199 138 Z"
            fill="#9f927c"
          />

          {/* Brow Arches */}
          <path
            d="M136 102 Q148 98 158 104"
            stroke="#877a67"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M184 102 Q172 98 162 104"
            stroke="#877a67"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Urna / Third Eye dot (Gold Accent) */}
          <circle cx="160" cy="98" r="2.5" fill="url(#goldAcc)" />

          {/* Downcast Serene Eyes */}
          <path
            d="M139 110 Q148 116 156 110"
            stroke="#776c59"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M181 110 Q172 116 164 110"
            stroke="#776c59"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Aquiline Nose Ridge */}
          <path
            d="M160 104 L158 128 L164 129"
            stroke="#8c7e6c"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Subtle Compassionate Smile */}
          <path
            d="M150 142 Q160 147 170 142"
            stroke="#776c59"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M153 147 Q160 150 167 147"
            stroke="#9d8f7b"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Gold leaf burnished patch across shoulder */}
          <path
            d="M132 178 Q145 174 158 180 Q170 174 188 178 Q175 186 160 184 Q145 186 132 178 Z"
            fill="url(#goldAcc)"
            fillOpacity="0.85"
          />
        </svg>
      )}

      {type === "vase" && (
        <svg
          viewBox="0 0 320 240"
          className="relative z-10 w-4/5 h-4/5 drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="chalkWhite" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f3ede1" />
              <stop offset="100%" stopColor="#dad0be" />
            </linearGradient>
            <linearGradient id="stemGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b48849" />
              <stop offset="100%" stopColor="#6e4f20" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse
            cx="160"
            cy="208"
            rx="48"
            ry="10"
            fill="#3c372e"
            fillOpacity="0.16"
          />

          {/* Botanical dried stems */}
          <path
            d="M160 120 Q145 70 130 35"
            stroke="url(#stemGold)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M160 120 Q168 60 178 30"
            stroke="url(#stemGold)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M160 120 Q155 80 150 45"
            stroke="url(#stemGold)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Fluffy pampas heads */}
          <circle cx="130" cy="35" r="7" fill="#cbbfae" fillOpacity="0.7" />
          <circle cx="178" cy="30" r="8" fill="#dfd5c4" fillOpacity="0.8" />
          <circle cx="150" cy="45" r="6" fill="#bfae96" fillOpacity="0.75" />

          {/* Ribbed Vase Body */}
          <path
            d="M148 110 C144 140 132 185 132 204 L188 204 C188 185 176 140 172 110 Z"
            fill="url(#chalkWhite)"
          />

          {/* Fluted Vertical Rib Lines */}
          <line
            x1="144"
            y1="125"
            x2="140"
            y2="204"
            stroke="#ded4c3"
            strokeWidth="2.5"
          />
          <line
            x1="152"
            y1="115"
            x2="150"
            y2="204"
            stroke="#ded4c3"
            strokeWidth="2.5"
          />
          <line
            x1="160"
            y1="110"
            x2="160"
            y2="204"
            stroke="#ded4c3"
            strokeWidth="2.5"
          />
          <line
            x1="168"
            y1="115"
            x2="170"
            y2="204"
            stroke="#ded4c3"
            strokeWidth="2.5"
          />
          <line
            x1="176"
            y1="125"
            x2="180"
            y2="204"
            stroke="#ded4c3"
            strokeWidth="2.5"
          />

          {/* Neck Lip Rim */}
          <ellipse
            cx="160"
            cy="110"
            rx="12"
            ry="4"
            fill="#ebe4d6"
            stroke="#bbaea0"
            strokeWidth="1"
          />
        </svg>
      )}

      {type === "aroma" && (
        <svg
          viewBox="0 0 320 240"
          className="relative z-10 w-4/5 h-4/5 drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="amberGlass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c88235" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#8d4b14" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#4e2406" />
            </linearGradient>
            <linearGradient id="brassDish" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3de9c" />
              <stop offset="50%" stopColor="#c5984f" />
              <stop offset="100%" stopColor="#7a5520" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse
            cx="160"
            cy="208"
            rx="65"
            ry="12"
            fill="#3c372e"
            fillOpacity="0.18"
          />

          {/* Brushed Brass Coaster Dish */}
          <ellipse cx="160" cy="204" rx="65" ry="10" fill="url(#brassDish)" />
          <ellipse cx="160" cy="202" rx="60" ry="8" fill="#a47738" />

          {/* 8 Natural Black Rattan Diffuser Reeds */}
          <line
            x1="160"
            y1="140"
            x2="120"
            y2="35"
            stroke="#26231f"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="160"
            y1="140"
            x2="135"
            y2="30"
            stroke="#26231f"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="160"
            y1="140"
            x2="150"
            y2="25"
            stroke="#26231f"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="160"
            y1="140"
            x2="162"
            y2="22"
            stroke="#26231f"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="160"
            y1="140"
            x2="175"
            y2="28"
            stroke="#26231f"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="160"
            y1="140"
            x2="190"
            y2="34"
            stroke="#26231f"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <line
            x1="160"
            y1="140"
            x2="200"
            y2="45"
            stroke="#26231f"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Heavy Amber Bottle Base */}
          <rect
            x="135"
            y="140"
            width="50"
            height="60"
            rx="6"
            fill="url(#amberGlass)"
          />

          {/* Glass Meniscus / Liquid Level */}
          <rect
            x="137"
            y="152"
            width="46"
            height="46"
            rx="4"
            fill="#a35b1d"
            fillOpacity="0.4"
          />

          {/* Glass Specular Highlight */}
          <rect
            x="140"
            y="144"
            width="4"
            height="52"
            rx="2"
            fill="#ffffff"
            fillOpacity="0.3"
          />

          {/* Bottle Collar & Lip */}
          <rect x="150" y="132" width="20" height="8" rx="2" fill="#321a08" />
          <ellipse cx="160" cy="132" rx="10" ry="3" fill="#b48849" />

          {/* Minimalist Label */}
          <rect x="145" y="162" width="30" height="24" rx="2" fill="#f8f4ec" />
          <line
            x1="150"
            y1="170"
            x2="170"
            y2="170"
            stroke="#141412"
            strokeWidth="1"
          />
          <line
            x1="152"
            y1="175"
            x2="168"
            y2="175"
            stroke="#b48849"
            strokeWidth="0.8"
          />
        </svg>
      )}

      {type === "planter" && (
        <svg
          viewBox="0 0 320 240"
          className="relative z-10 w-4/5 h-4/5 drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="sandstonePot"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#e5d0b8" />
              <stop offset="50%" stopColor="#cdae90" />
              <stop offset="100%" stopColor="#a38265" />
            </linearGradient>
            <linearGradient id="jadeLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#75a67c" />
              <stop offset="60%" stopColor="#44734c" />
              <stop offset="100%" stopColor="#28482e" />
            </linearGradient>
          </defs>

          {/* Shadow */}
          <ellipse
            cx="160"
            cy="208"
            rx="55"
            ry="11"
            fill="#3c372e"
            fillOpacity="0.18"
          />

          {/* Integrated Drainage Saucer */}
          <rect x="122" y="198" width="76" height="8" rx="3" fill="#8f6e52" />

          {/* Fluted Pot Body */}
          <path
            d="M125 145 L130 198 L190 198 L195 145 Z"
            fill="url(#sandstonePot)"
          />

          {/* Fluted Ribs */}
          <line
            x1="138"
            y1="145"
            x2="141"
            y2="198"
            stroke="#b59475"
            strokeWidth="2"
          />
          <line
            x1="150"
            y1="145"
            x2="151"
            y2="198"
            stroke="#b59475"
            strokeWidth="2"
          />
          <line
            x1="162"
            y1="145"
            x2="162"
            y2="198"
            stroke="#b59475"
            strokeWidth="2"
          />
          <line
            x1="174"
            y1="145"
            x2="173"
            y2="198"
            stroke="#b59475"
            strokeWidth="2"
          />
          <line
            x1="186"
            y1="145"
            x2="183"
            y2="198"
            stroke="#b59475"
            strokeWidth="2"
          />

          {/* Pot Rim */}
          <ellipse
            cx="160"
            cy="145"
            rx="35"
            ry="8"
            fill="#d2b89c"
            stroke="#9e7b5d"
            strokeWidth="1"
          />
          <ellipse cx="160" cy="145" rx="30" ry="6" fill="#3b2b1d" />

          {/* Jade Succulent / Plant Fronds */}
          <path
            d="M160 145 Q150 110 135 90 Q155 105 160 145 Z"
            fill="url(#jadeLeaf)"
          />
          <path
            d="M160 145 Q170 110 185 90 Q165 105 160 145 Z"
            fill="url(#jadeLeaf)"
          />
          <path d="M160 145 Q160 95 160 70 Q165 95 160 145 Z" fill="#5a8b62" />
          <path
            d="M160 145 Q135 125 120 115 Q140 130 160 145 Z"
            fill="url(#jadeLeaf)"
          />
          <path
            d="M160 145 Q185 125 200 115 Q180 130 160 145 Z"
            fill="url(#jadeLeaf)"
          />
        </svg>
      )}

      {badge && (
        <div className="absolute top-3 left-3 bg-[#141412] text-[#f6f3ec] text-[10px] tracking-widest font-semibold px-2.5 py-1 rounded-sm uppercase">
          {badge}
        </div>
      )}
    </div>
  );
};
