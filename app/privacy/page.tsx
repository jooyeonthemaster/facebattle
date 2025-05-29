'use client';

import Header from '@/src/components/Header';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">개인정보처리방침</h1>
          
          <div className="space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 개인정보의 처리목적</h2>
              <p className="leading-relaxed">
                마법의 거울(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 
                처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
                이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>얼굴 분석 서비스 제공</li>
                <li>AI 기반 미모 평가 및 대결 서비스 제공</li>
                <li>서비스 이용 통계 분석 및 개선</li>
                <li>부정 이용 방지 및 서비스 보안</li>
              </ul>
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold">
                  ⚠️ 중요: 회사는 서비스 제공 목적 외에는 일체의 개인정보를 활용하지 않습니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 개인정보의 처리 및 보유기간</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">처리목적</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">개인정보 항목</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">보유기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">얼굴 이미지</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">
                        • 얼굴 분석 및 미모 평가<br/>
                        • 다른 사용자와의 대결 서비스<br/>
                        • 랭킹 시스템 제공<br/>
                        • 대결 결과 공유 기능
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">
                        서비스 이용 종료 시까지<br/>
                        (최대 1년, 사용자 요청 시 즉시 삭제)
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">서비스 개선</td>
                      <td className="border border-gray-300 px-4 py-2">이용 통계 (익명화)</td>
                      <td className="border border-gray-300 px-4 py-2">3년</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 개인정보의 제3자 제공</h2>
              <p className="leading-relaxed">
                회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 
                다만, 아래의 경우에는 예외로 합니다:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 개인정보처리 위탁</h2>
              <p className="leading-relaxed">
                회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
              </p>
              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">수탁업체</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">위탁업무</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">개인정보 보유기간</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Google LLC</td>
                      <td className="border border-gray-300 px-4 py-2">AI 얼굴 분석 서비스</td>
                      <td className="border border-gray-300 px-4 py-2">분석 완료 즉시 삭제</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Firebase (Google)</td>
                      <td className="border border-gray-300 px-4 py-2">데이터 저장 및 관리</td>
                      <td className="border border-gray-300 px-4 py-2">서비스 이용기간</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 정보주체의 권리·의무 및 행사방법</h2>
              <p className="leading-relaxed">
                이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>개인정보 처리정지 요구권</li>
                <li>개인정보 열람요구권</li>
                <li>개인정보 정정·삭제요구권</li>
                <li>개인정보 처리정지 요구권</li>
              </ul>
              <p className="mt-4 leading-relaxed">
                위의 권리 행사는 개인정보보호법 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 
                회사는 이에 대해 지체없이 조치하겠습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 개인정보의 안전성 확보조치</h2>
              <p className="leading-relaxed">
                회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>개인정보 취급 직원의 최소화 및 교육</li>
                <li>개인정보에 대한 접근 제한</li>
                <li>개인정보의 암호화</li>
                <li>해킹 등에 대비한 기술적 대책</li>
                <li>개인정보처리시스템 등의 접근권한 관리</li>
                <li>접근통제시스템 설치</li>
                <li>개인정보의 안전한 저장</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. 생체정보 처리 특별 조치</h2>
              <div className="bg-red-50 border border-red-300 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                  <span className="mr-2">⚠️</span>
                  생체정보 처리 특별 조치
                </h3>
                <div className="space-y-4 text-red-700">
                  <div>
                    <h4 className="font-semibold mb-2">🔐 보안 조치</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>얼굴 이미지는 암호화하여 안전하게 저장</li>
                      <li>접근 권한을 엄격히 제한하여 관리</li>
                      <li>정기적인 보안 점검 및 업데이트 실시</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">📅 보관 및 삭제 정책</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>서비스 제공을 위해 필요한 기간 동안만 보관 (최대 1년)</li>
                      <li>사용자 요청 시 즉시 삭제 처리</li>
                      <li>서비스 목적 외 절대 사용 금지</li>
                      <li>일정 기간 미사용 시 자동 삭제</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">👤 사용자 권리</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>언제든지 개인정보 삭제 요청 가능</li>
                      <li>개인정보 처리 현황 확인 요청 가능</li>
                      <li>개인정보 처리 정지 요청 가능</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. 개인정보 보호책임자</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">개인정보 보호책임자</p>
                <p>성명: 개인정보보호책임자</p>
                <p>연락처: privacy@facebattle.com</p>
                <p className="mt-2 text-sm text-gray-600">
                  개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. 개인정보 처리방침 변경</h2>
              <p className="leading-relaxed">
                이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                  <strong>시행일자:</strong> 2024년 1월 1일<br/>
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