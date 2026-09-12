# 간병24 1.1.4

분당서울대학교병원 간병 업무를 위한 안드로이드 앱과 웹사이트 소스입니다.

## 1.1.4 변경사항

- Android 앱 버전: **1.1.4** (`versionCode 13`)
- **간병인 의뢰**를 누르면 **환자·보호자용 간병 의뢰서**가 열리고 제목과 입력란으로 바로 이동합니다.
- 다른 업무 화면에서 의뢰서로 돌아올 때도 정상적으로 열리도록 화면 연결을 수정했습니다.

## 설치 및 실행

- [간병24 1.1.4 APK 다운로드](releases/care24-v1.1.4.apk)
- [간병24 웹사이트 열기](https://ganbyeong24-bundang-snuh.samganid5197259555.chatgpt.site)

APK는 테스트용 debug 빌드입니다. 설치된 앱은 스마트폰의 기본 브라우저에서 위 웹사이트를 엽니다.

## 소스 구성

| 경로 | 내용 |
| --- | --- |
| `android-project/` | Android Studio 프로젝트 |
| `web-site/` | 환자·보호자 의뢰서 및 간병 업무 웹사이트 |
| `releases/care24-v1.1.4.apk` | 스마트폰 설치 파일 |
| `CHANGELOG.md` | 변경 및 확인 내역 |

Android Studio에서 `android-project`를 열어 로컬 Android SDK 경로를 설정합니다. JDK 17 이상과 Android SDK 35가 필요하며, `gradlew.bat assembleDebug`로 APK를 생성할 수 있습니다. 자세한 내용은 [안드로이드 프로젝트 안내](android-project/README.md)를 참고하세요.

웹사이트의 의존성 버전은 `web-site/package-lock.json`에 고정되어 있습니다. 웹사이트는 Cloudflare Workers의 D1 및 R2를 사용하며, 기존 빌드 스크립트는 Bash 환경을 기준으로 합니다. 로컬 실행에는 별도의 데이터베이스 준비가 필요합니다.
