# System Security Project

보안 취약점 분석 및 관리를 위한 통합 시스템입니다. CVE(Common Vulnerabilities and Exposures) 데이터베이스 조회, EPSS 점수 분석, CVSS 점수 계산 등의 기능을 제공하며, 웹 대시보드를 통해 히스토리와 통계를 확인할 수 있습니다.

## 프로젝트 구조

```
system_security_project-new/
├── vulnerability-intelligence-mcp-server-master/  # 백엔드 API 서버
│   ├── mcp_simple_tool/                          # 메인 애플리케이션
│   │   ├── api_server.py                         # FastAPI 서버 (History & Dashboard)
│   │   ├── server.py                             # MCP 서버
│   │   ├── tools/                                # 보안 도구 모음
│   │   │   ├── cve_lookup.py                     # CVE 취약점 조회
│   │   │   ├── epss_lookup.py                    # EPSS 점수 조회
│   │   │   ├── cvss_calculator.py                # CVSS 점수 계산
│   │   │   ├── exploit_availability.py           # Exploit 가용성 확인
│   │   │   ├── package_vulnerability.py          # Python 패키지 취약점 검사
│   │   │   └── vulnerability_timeline.py         # 취약점 타임라인
│   │   └── data/                                 # 데이터베이스 (history.db)
│   ├── docker-compose.yml                        # Docker Compose 설정
│   └── Dockerfile                                # Docker 이미지 빌드 파일
│
└── Admin-FE-main/                                # 프론트엔드 대시보드
    ├── app/                                      # Next.js 앱
    ├── components/                               # React 컴포넌트
    ├── package.json                              # Node.js 의존성
    └── .env.local                                # 환경 변수 (생성 필요)
```

## 주요 기능

### 백엔드 API 서버

1. **CVE 취약점 조회** (`/api/cve/{cve_id}`)
   - NIST National Vulnerability Database에서 CVE 정보 조회
   - CVSS 점수, 취약점 설명, 영향받는 제품 등 상세 정보 제공

2. **EPSS 점수 조회** (`/api/epss/{cve_id}`)
   - Exploit Prediction Scoring System 점수 조회
   - 30일 내 악용 가능성 예측

3. **CVSS 점수 계산** (`/api/cvss`)
   - CVSS 벡터 문자열로부터 점수 계산
   - CVSS v3.0/v3.1 지원

4. **패키지 취약점 검사** (`/api/package/{package_name}`)
   - Python 패키지의 알려진 취약점 검사
   - OSV 데이터베이스 연동

5. **Exploit 가용성 확인** (`/api/exploit/{cve_id}`)
   - 공개된 Exploit 및 PoC 확인
   - ExploitDB, Metasploit, GitHub 검색

6. **히스토리 & 대시보드** (`/api/history`, `/api/dashboard/summary`)
   - 모든 검색 기록 저장 및 조회
   - 통계 및 최근 활동 요약

### 프론트엔드 대시보드

- **대시보드**: 최근 검색 기록 및 통계 시각화
- **CVE 검색**: CVE ID로 취약점 정보 조회
- **히스토리**: 과거 검색 기록 확인 및 재조회
- **AI 분석**: Claude API를 활용한 취약점 분석

## 설치 및 실행

### 사전 요구사항

- Docker & Docker Desktop (백엔드 실행용)
- Node.js 18+ & npm (프론트엔드 실행용)
- Anthropic API Key (AI 분석 기능 사용 시)

### 1. 백엔드 서버 실행 (Docker)

```bash
# Docker Desktop 실행 확인

# 프로젝트 디렉토리로 이동
cd vulnerability-intelligence-mcp-server-master

# Docker Compose로 서버 실행
docker compose up --build -d

# 로그 확인
docker compose logs -f

# 서버 종료
docker compose down
```

백엔드 서버는 **http://localhost:8000** 에서 실행됩니다.

### 2. 프론트엔드 서버 실행

```bash
# 프론트엔드 디렉토리로 이동
cd Admin-FE-main

# 환경 변수 파일 생성
# .env.local 파일을 생성하고 아래 내용 추가:
# ANTHROPIC_API_KEY=your_api_key_here
# NEXT_PUBLIC_API_URL=http://localhost:8000

# 의존성 설치
npm install --legacy-peer-deps

# 개발 서버 실행
npm run dev
```

프론트엔드는 **http://localhost:3000** (또는 3000번 포트가 사용 중이면 3001)에서 실행됩니다.

## 환경 변수 설정

### 프론트엔드 (.env.local)

`Admin-FE-main/.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Anthropic Claude API 키 (AI 분석 기능 사용 시 필요)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# 백엔드 API 서버 주소
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 백엔드 (선택사항)

필요한 경우 `vulnerability-intelligence-mcp-server-master/.env` 파일을 생성할 수 있습니다:

```env
MCP_SERVER_PORT=8000
MCP_SERVER_HOST=0.0.0.0
DEBUG=false
```

## API 엔드포인트

### CVE & 취약점 정보

- `GET /api/cve/{cve_id}` - CVE 정보 조회
- `GET /api/epss/{cve_id}` - EPSS 점수 조회
- `POST /api/cvss` - CVSS 점수 계산 (body: `{"vector": "CVSS:3.1/..."}`)
- `GET /api/exploit/{cve_id}` - Exploit 가용성 확인
- `GET /api/timeline/{cve_id}` - 취약점 타임라인
- `GET /api/package/{package_name}` - Python 패키지 취약점 검사

### 히스토리 & 대시보드

- `GET /api/history` - 전체 검색 히스토리 조회
  - Query parameters: `limit`, `action` (필터링)
- `GET /api/history/{id}` - 특정 히스토리 항목 조회
- `GET /api/dashboard/summary` - 대시보드 요약 통계

## 사용 예시

### CVE 조회

```bash
curl http://localhost:8000/api/cve/CVE-2021-44228
```

### EPSS 점수 확인

```bash
curl http://localhost:8000/api/epss/CVE-2021-44228
```

### CVSS 점수 계산

```bash
curl -X POST http://localhost:8000/api/cvss \
  -H "Content-Type: application/json" \
  -d '{"vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"}'
```

### 히스토리 조회

```bash
curl http://localhost:8000/api/history?limit=10
```

## 데이터 소스

- **CVE 데이터**: [NIST National Vulnerability Database](https://nvd.nist.gov/)
- **EPSS 점수**: [FIRST EPSS API](https://www.first.org/epss/)
- **패키지 취약점**: [OSV (Open Source Vulnerabilities)](https://osv.dev/)
- **패키지 메타데이터**: [PyPI](https://pypi.org/)

## 트러블슈팅

### Docker Desktop이 실행되지 않을 때

```
Error: open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

→ Docker Desktop을 실행하고 완전히 시작될 때까지 기다린 후 다시 시도하세요.

### 포트 8000이 이미 사용 중일 때

```bash
# Windows에서 포트 8000을 사용하는 프로세스 확인
netstat -ano | findstr :8000

# PID를 확인한 후 프로세스 종료
taskkill /F /PID <PID번호>
```

### 프론트엔드 의존성 설치 오류

React 19와 일부 패키지 간의 peer dependency 충돌이 발생할 수 있습니다:

```bash
npm install --legacy-peer-deps
```

### API 키 설정 오류

`.env.local` 파일이 올바르게 생성되었는지 확인하고, Next.js 서버를 재시작하세요:

```bash
# 서버 종료 (Ctrl+C)
# 다시 실행
npm run dev
```

## 기술 스택

### 백엔드
- **Python 3.10+**
- **FastAPI** - REST API 프레임워크
- **Uvicorn** - ASGI 서버
- **SQLite** - 히스토리 데이터베이스
- **httpx** - HTTP 클라이언트
- **Docker** - 컨테이너화

### 프론트엔드
- **Next.js 15** - React 프레임워크
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **Radix UI** - UI 컴포넌트
- **Recharts** - 데이터 시각화

## 라이선스

MIT License

## 참고 문서

- [vulnerability-intelligence-mcp-server README](./vulnerability-intelligence-mcp-server-master/README.md)
- [NIST NVD API 문서](https://nvd.nist.gov/developers)
- [FIRST EPSS 문서](https://www.first.org/epss/api)
- [CVSS v3.1 사양](https://www.first.org/cvss/v3.1/specification-document)
