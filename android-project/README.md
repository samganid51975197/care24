# 간병24 안드로이드 앱

분당서울대학교병원 통합간병 사이트를 안드로이드 앱 안에서 실행하는 Android Studio 프로젝트입니다.

- 앱 이름: 간병24
- 패키지명: `kr.or.care24.app`
- 앱 버전: 1.1.4 (`versionCode 13`)
- 연결 주소: `https://ganbyeong24-bundang-snuh.samganid5197259555.chatgpt.site`

## 준비물

- Android Studio 최신 안정 버전
- Android SDK 35
- JDK 17

앱을 실행하면 스마트폰의 기본 인터넷 브라우저에서 최신 웹사이트를 엽니다. 앱 내부 WebView에서 ChatGPT 로그인 화면이 반복되는 문제를 피하고, 브라우저에 저장된 상태를 이용합니다. `간병인 의뢰`를 누르면 `환자·보호자용 간병 의뢰서`를 열고 입력란으로 바로 이동하는 최신 사이트가 연결되며, 이후 사이트 수정사항도 APK를 다시 만들지 않아도 반영됩니다.

## 실행 순서

1. 압축을 `C:\care24\care24-android-app`처럼 영문 경로에 푸는 것을 권장합니다.
2. Android Studio를 실행합니다.
3. **Open**을 누르고 압축을 푼 `android-project` 폴더를 선택합니다.
4. Android Studio의 **Settings → Build, Execution, Deployment → Build Tools → Gradle**에서 Gradle JDK를 **17**로 지정합니다.
5. 필요한 Android SDK 및 Gradle 구성요소가 자동 설치되고 동기화될 때까지 기다립니다.
6. 안드로이드 휴대전화에서 **개발자 옵션 → USB 디버깅**을 켭니다.
7. USB로 휴대전화를 연결하고 상단의 실행 ▶ 버튼을 누릅니다.

한글 폴더에서 열더라도 빌드할 수 있도록 `android.overridePathCheck=true` 설정이 포함되어 있습니다. 다만 Android SDK와 일부 도구에서 한글 경로 문제가 발생할 수 있어 영문 경로 사용이 가장 안전합니다.

## APK 만들기

1. Android Studio 메뉴에서 **Build → Build Bundle(s) / APK(s) → Build APK(s)**를 선택합니다.
2. 생성된 시험용 APK는 `app/build/outputs/apk/debug/app-debug.apk`에 있습니다.

## Google Play 등록용 AAB 만들기

1. **Build → Generate Signed Bundle / APK**를 선택합니다.
2. **Android App Bundle**을 선택합니다.
3. 협회가 보관할 서명키를 새로 만들거나 기존 키를 선택합니다.
4. `release` 빌드를 선택하여 AAB 파일을 만듭니다.
5. 생성된 AAB를 Google Play Console에 올립니다.

## 중요한 운영 주의사항

- 이 프로젝트는 최신 간병24 웹사이트를 스마트폰의 기본 브라우저로 여는 버전입니다.
- 신청서·계약서·서명 등 자료의 저장 방식은 연결된 사이트의 운영정책을 따릅니다.
- 실제 환자와 돌봄인이 함께 쓰는 정식 서비스로 공개하기 전에는 로그인, 사용자 권한, 중앙 서버 저장, 암호화, 개인정보 처리방침, 탈퇴·삭제 기능을 추가해야 합니다.
- 앱 서명키 파일과 비밀번호는 외부에 보내지 말고 협회가 안전하게 보관해야 합니다.

## 연결 사이트 변경

다른 사이트를 연결하려면 `MainActivity.java`의 `APP_URL` 값을 변경한 뒤 APK를 다시 빌드합니다.
