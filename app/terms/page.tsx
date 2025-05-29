'use client';

import Header from '@/src/components/Header';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">서비스 이용약관</h1>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
              <p className="leading-relaxed">
                이 약관은 마법의 거울(이하 "회사")이 제공하는 AI 기반 얼굴 분석 및 미모 대결 서비스(이하 "서비스")의 이용과 관련하여 
                회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>"서비스"</strong>란 회사가 제공하는 AI 기반 얼굴 분석, 미모 평가, 미모 대결 등의 서비스를 의미합니다.</li>
                <li><strong>"이용자"</strong>란 이 약관에 따라 회사가 제공하는 서비스를 받는 자를 의미합니다.</li>
                <li><strong>"생체정보"</strong>란 이용자가 업로드하는 얼굴 이미지 등 개인을 식별할 수 있는 신체적 특징 정보를 의미합니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h2>
              <p className="leading-relaxed mb-4">
                ① 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.
              </p>
              <p className="leading-relaxed">
                ② 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지 또는 통지함으로써 효력을 발생합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (서비스의 제공)</h2>
              <p className="leading-relaxed mb-4">
                ① 회사는 다음과 같은 서비스를 제공합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>AI 기반 얼굴 분석 및 미모 평가 서비스</li>
                <li>성별별 미모 대결 매칭 서비스</li>
                <li>랭킹 및 통계 서비스</li>
                <li>기타 회사가 정하는 서비스</li>
              </ul>
              <p className="leading-relaxed">
                ② 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 단, 시스템 점검 등의 사유로 서비스가 중단될 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (이용자의 의무)</h2>
              <p className="leading-relaxed mb-4">
                ① 이용자는 다음 행위를 하여서는 안 됩니다:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>타인의 얼굴 이미지를 무단으로 업로드하는 행위</li>
                <li>음란하거나 폭력적인 이미지를 업로드하는 행위</li>
                <li>서비스의 안정적 운영을 방해하는 행위</li>
                <li>다른 이용자에게 피해를 주는 행위</li>
                <li>관련 법령을 위반하는 행위</li>
              </ul>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold">
                  ⚠️ 중요: 반드시 본인의 얼굴 이미지만 업로드해야 하며, 타인의 이미지 무단 사용 시 법적 책임을 질 수 있습니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (개인정보 보호)</h2>
              <p className="leading-relaxed mb-4">
                ① 회사는 이용자의 개인정보 보호를 위해 개인정보보호법 등 관련 법령을 준수합니다.
              </p>
              <p className="leading-relaxed mb-4">
                ② 업로드된 얼굴 이미지는 AI 분석 완료 즉시 자동으로 삭제되며, 어떠한 목적으로도 저장되지 않습니다.
              </p>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  <strong>개인정보 처리방침:</strong> 자세한 개인정보 처리 내용은 별도의 개인정보처리방침을 참조하시기 바랍니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (서비스 이용의 제한)</h2>
              <p className="leading-relaxed mb-4">
                ① 회사는 이용자가 다음 중 하나에 해당하는 경우 서비스 이용을 제한할 수 있습니다:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>이 약관을 위반한 경우</li>
                <li>타인의 권리를 침해한 경우</li>
                <li>서비스의 정상적인 운영을 방해한 경우</li>
                <li>관련 법령을 위반한 경우</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제8조 (면책조항)</h2>
              <p className="leading-relaxed mb-4">
                ① 회사는 다음의 경우에 대해 책임을 지지 않습니다:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력으로 인한 서비스 중단</li>
                <li>이용자의 귀책사유로 인한 서비스 이용 장애</li>
                <li>이용자가 서비스를 통해 얻은 정보로 인한 손해</li>
                <li>이용자 간 또는 이용자와 제3자 간의 분쟁</li>
              </ul>
              <p className="leading-relaxed">
                ② AI 분석 결과는 참고용이며, 회사는 분석 결과의 정확성을 보장하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제9조 (지적재산권)</h2>
              <p className="leading-relaxed">
                ① 서비스에 대한 저작권 및 지적재산권은 회사에 귀속됩니다.
              </p>
              <p className="leading-relaxed">
                ② 이용자는 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">제10조 (분쟁해결)</h2>
              <p className="leading-relaxed">
                ① 회사와 이용자 간에 발생한 분쟁에 관한 소송은 대한민국 법을 적용하며, 회사의 본사 소재지를 관할하는 법원을 관할법원으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">부칙</h2>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-800">
                  <strong>시행일:</strong> 이 약관은 2024년 1월 1일부터 시행됩니다.<br/>
                  <strong>최종 수정일:</strong> 2024년 1월 1일
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 