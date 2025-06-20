import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { motion } from "framer-motion";

const data = [
  {
    title: "Мисия и Визия",
    content: (
      <div className="space-y-6 text-left">
        <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg font-normal">
          В Automation Aid се стремим да превърнем мечтите за недвижим имот в осезаема реалност. Нашата мисия е да предоставяме пълноценна и прозрачна услуга, базирана на професионализъм и доверие.
        </p>
        <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg font-normal">
          Вярваме, че домът е много повече от квадратни метри – той е отражение на личността, идеите и плановете за бъдещето. С ясна визия за развитие на пазара, ние търсим иновативни решения, които да улеснят вашето решение и инвестиция.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 justify-items-start">
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80" 
              className="rounded-lg object-cover h-40 md:h-56 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition-all duration-300"
              alt="Модерен офис с визия за бъдещето"
              whileHover={{ filter: "brightness(1.1)" }}
              loading="lazy"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full"
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2084&q=80" 
              className="rounded-lg object-cover h-40 md:h-56 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition-all duration-300"
              alt="Професионален екип в работа"
              whileHover={{ filter: "brightness(1.1)" }}
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    title: "Комплексни Услуги",
    content: (
      <div className="space-y-6 text-left">
        <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg font-normal">
          Automation Aid предлага цялостно обслужване през целия процес на сделката – от първоначалния анализ на пазара до успешно финализиране и съдействие с документацията.
        </p>
        <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg font-normal">
          За купувачите подбираме най-подходящите оферти според вашите критерии и бюджет, а за продавачите разработваме маркетингова стратегия, която гарантира максимална видимост и бърз резултат. Нашите експерти работят с доказани партньори – адвокати, оценители и ипотечни консултанти, за да ви спестят време и рискове.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 justify-items-start">
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2088&q=80"
              className="rounded-lg object-cover h-40 md:h-56 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition-all duration-300"
              alt="Професионален консултант по недвижими имоти"
              whileHover={{ filter: "brightness(1.1)" }}
              loading="lazy"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              className="rounded-lg object-cover h-40 md:h-56 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition-all duration-300"
              alt="Експерт по недвижими имоти в офиса"
              whileHover={{ filter: "brightness(1.1)" }}
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    title: "Опит",
    content: (
      <div className="space-y-6 text-left">
        <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg font-normal">
          Зад всеки успешен проект стои силен и опитен екип. В Automation Aid събираме специалисти с богат опит в недвижимите имоти, маркетинга и консултирането на клиенти.
        </p>
        <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg font-normal">
          Всеки наш агент преминава през интензивно вътрешно обучение и използва модерни софтуерни решения за анализ на пазарни данни. По този начин ние гарантираме, че ще получите адекватна информация, базирана на реални трендове и статистики, и ще вземете най-доброто решение.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 justify-items-start">
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
              className="rounded-lg object-cover h-40 md:h-56 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition-all duration-300"
              alt="Екип от професионалисти в съвещание"
              whileHover={{ filter: "brightness(1.1)" }}
              loading="lazy"
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              className="rounded-lg object-cover h-40 md:h-56 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition-all duration-300"
              alt="Опитен член на екипа в работа"
              whileHover={{ filter: "brightness(1.1)" }}
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    title: "Ангажимент",
    content: (
      <div className="space-y-6 text-left">
        <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg font-normal">
          За нас клиентът е в центъра на всичко. Стремим се не само да откликнем на вашите нужди, но и да надминем очакванията ви чрез лично отношение и следпродажбено обслужване.
        </p>
        <p className="text-neutral-800 dark:text-neutral-200 text-base md:text-lg font-normal">
          Всяка препоръка, всяка оценка и всяка обратна връзка са ценни, защото ни помагат да усъвършенстваме процесите си. Вашият успех и спокойствие са наш приоритет.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 justify-items-start">
          <motion.div
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              className="rounded-lg object-cover h-40 md:h-56 lg:h-72 w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] transition-all duration-300"
              alt="Ангажиран лидер в екипа"
              whileHover={{ filter: "brightness(1.1)" }}
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    ),
  },
];

export function TimelineDemo() {
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
} 