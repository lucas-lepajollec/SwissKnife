import React from 'react';
import { Upload, Music, Video, Image as ImageIcon, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export function Dropzone() {
  return (
    <div className="relative h-full min-h-[400px] w-full rounded-3xl border border-dashed border-white/10 bg-[#0A0A0A] p-8 transition-colors hover:bg-white/[0.02] group overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <div className="flex gap-4 mb-8">
          {[
            { icon: Music, color: "text-blue-400", bg: "bg-blue-400/10" },
            { icon: Video, color: "text-purple-400", bg: "bg-purple-400/10" },
            { icon: ImageIcon, color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { icon: FileText, color: "text-orange-400", bg: "bg-orange-400/10" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} border border-white/5`}
            >
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </motion.div>
          ))}
        </div>

        <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">
          Déposez n'importe quel fichier
        </h3>
        <p className="text-gray-400 mb-8 max-w-md text-sm leading-relaxed">
          Audio, Vidéo, Image ou Document. <br />
          Vos fichiers ne quittent jamais votre navigateur.
        </p>

        <button className="group relative inline-flex items-center justify-center rounded-full bg-white/5 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:scale-105 active:scale-95 border border-white/10">
          <span className="mr-2">Ou cliquez pour parcourir</span>
          <Upload className="h-4 w-4 opacity-50 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
