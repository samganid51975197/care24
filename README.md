# 간병24 1.1.5

1.1.4 이후 수정 내용을 포함한 웹·안드로이드 소스입니다.

- Android: 1.1.5 (versionCode 15), SDK 36
- 웹: web-site/package.json 1.1.5
- 변경 내역: [CHANGELOG.md](CHANGELOG.md)
- [개발용 APK](releases/care_24_1.1.5-debug.apk): 로컬 서버 3100과 USB 연결 필요
- [서명된 APK](releases/care_24_1.1.5-release.apk): 간병24.com 운영 서버에 연결
- [Play 업로드용 AAB](releases/care_24_1.1.5-release.aab)

문자·카카오톡 발송 연결, 운영 웹 배포 및 Play 출시는 완료된 것으로 간주하지 않습니다. APK에는 웹 수정본이 내장되지 않으므로 운영 사용에는 web-site 배포가 필요합니다.

개인키·비밀번호·운영 데이터베이스는 소스 및 배포 압축 파일에 포함하지 않습니다.

## 개발 서버 설정

로컬 실행 전 web-site/.env.local에 CARE24_ORIGIN=http://127.0.0.1:3100 및 CARE24_DATABASE_URL=file:.private/preview.db를 설정하세요. CARE24_UPLOAD_DIR은 비공개 첨부 폴더, CARE24_KEY_FILE은 기존 암호화 키 파일을 가리켜야 합니다. 키를 새로 덮어쓰면 기존 자료를 읽을 수 없습니다. 환경 파일과 DB는 Git에 올리지 않습니다.

관리자 비밀번호 복구용 scripts/reset-local-admin.ps1은 이 개발 PC의 기존 관리자 계정 전용 도구이며, 실행자가 새 비밀번호를 직접 입력합니다. 비밀번호 자체는 포함되어 있지 않습니다.

검증: TypeScript 검사 및 기능·암호화 테스트 16개 통과.
