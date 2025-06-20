import React from 'react';
import { Helmet } from 'react-helmet';
import Footer from '@/components/Footer'; // Assuming this path is correct
import Navbar from '@/components/Navbar'; // Assuming this path is correct

const CookiePolicyPage = () => {
  // Function to handle cookie deletion - this would typically trigger a more complex mechanism
  const handleDeleteCookies = () => {
    alert('Механизмът за изтриване на бисквити от сайта трябва да бъде имплементиран тук.');
    // Add your actual cookie deletion logic here
    // For example, clearing specific cookies set by your domain
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Политика за бисквитки | Automation Aid</title>
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-center mt-20">Политика за използване на бисквитки</h1>
        
        <div className="prose max-w-none lg:prose-lg xl:prose-xl">
          <p className="mb-4 text-center font-semibold text-lg">
            Тук можете да се запознаете с ползваните бисквити и други технологии за съхранение на информация във връзка с предоставяните услуги ("Услугите") в сайта www.automationaid.bg и/или мобилните версии и приложения ("Сайта").
          </p>
          
          <p className="mb-8 text-center font-bold text-[#E42B57] bg-[#FCE7EC] p-3 rounded-md">
            Важно: Политиката е в сила от 11 март 2025.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Какво представляват бисквитките?</h2>
          <p className="mb-4">
            Бисквитите са информация, съхранена във Вашия браузър (или мобилно приложение). Те се използват за съхранение на настройки и идентификатори, необходими за някои от предоставяните в Сайта услуги.
          </p>
          <p className="mb-6">
            "Automation Aid" ООД прилага стриктна политика в съответствие с новите изисквания на ЕС.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">За какво използваме бисквитки?</h2>
          <p className="mb-6">
            Бисквити се използват за следните цели:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold">Сесия и управление на навигацията</h3>
              <p className="mt-1"><strong>Вид:</strong> Идентификатор на сесията, защита на сигурността, предишна стъпка за бутона "обратно" и др.</p>
              <p><strong>Срок на съхранение:</strong> Временно (за времето на престоя Ви в Сайта).</p>
              <p><strong>Описание:</strong> Тези бисквити са технически необходими за вход, управление на навигацията и ползването на Сайта. Сайтът не може да функционира надеждно и нормално без тях.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Настройки</h3>
              <p className="mt-1"><strong>Вид:</strong> Език на Сайта, избор за ползване на мобилна или десктоп версия, скриване на информационни кутии.</p>
              <p><strong>Срок на съхранение:</strong> До 6 /шест/ месеца от последното ползване.</p>
              <p><strong>Описание:</strong> Това са бисквити, които се използват за запазване на Вашите настройки; които Ви дават възможност да скриете информационни кутии, с които сте се запознали и др. под.</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Функционалност "Бързи линкове за търсене"</h3>
              <p><strong>Срок на съхранение:</strong> До 6 /шест/ месеца от последното ползване.</p>
              <p><strong>Описание:</strong> В случай че ползвате тази опция, имате възможност да повтаряте бързо и лесно предишно търсене (от последните 10 търсения).</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Функционалност "Автоматично влизане в акаунта"</h3>
              <p><strong>Срок на съхранение:</strong> До 6 /шест/ месеца от последното ползване.</p>
              <p><strong>Описание:</strong> В случай че ползвате тази опция, тя Ви позволява да влизате автоматично във Вашия акаунт.</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mt-10 mb-4">Управление на бисквитките</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Изтриване на бисквитите от нашия сайт (www.automationaid.bg)</h3>
          <p className="mb-4">
            В www.automationaid.bg е предвидена специална функционалност, позволяваща Ви да изтриете всички бисквити, поставени от нашия сайт. В случай че желаете да направите това, използвайте следния бутон:
          </p>
          <p className="text-sm mt-2 italic">
            (Забележка: Това действие ще изтрие бисквитките, зададени от www.automationaid.bg, във Вашия текущ браузър. Може да се наложи да влезете отново или да конфигурирате някои настройки.)
          </p>

          <h3 className="text-xl font-semibold mt-8 mb-3">Контрол на бисквитите в браузъра</h3>
          <p className="mb-4">
            В случай че желаете, можете да използвате и настройките на Вашия браузър, за да изтриете и/или забраните получаването на бисквити от конкретен или от всички сайтове. Можете да намерите повече информация за управлението на бисквитките в помощната секция на Вашия браузър или на сайтове като <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.allaboutcookies.org</a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicyPage;