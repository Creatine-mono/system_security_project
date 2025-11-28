# Coming Soon - 통합 웹 애플리케이션

## 📋 프로젝트 개요

이 프로젝트는 4개의 독립적인 Next.js 프로젝트를 하나로 통합한 웹 애플리케이션입니다.

### 통합된 프로젝트들
1. **coming-soon** (메인 랜딩 페이지)
2. **login** (로그인 페이지)
3. **next-js-forms** (폼 페이지)
4. **admin-dashboard** (관리자 대시보드)

---

## 📁 프로젝트 구조

```
coming-soon/
├── app/                          # Next.js 15 App Router
│   ├── dashboard/                # 관리자 대시보드 (admin-dashboard에서 복사)
│   │   ├── dashboard/            # 대시보드 메인 페이지
│   │   │   └── page.tsx
│   │   ├── settings/             # 설정 페이지
│   │   │   └── page.tsx
│   │   ├── users/                # 사용자 관리 페이지
│   │   │   └── page.tsx
│   │   └── layout.tsx            # 대시보드 레이아웃 (사이드바 포함)
│   │
│   ├── forms/                    # 폼 페이지 (next-js-forms에서 복사)
│   │   └── page.tsx              # 컨택트 폼 페이지
│   │
│   ├── login/                    # 로그인 페이지 (login에서 복사)
│   │   └── page.tsx              # 로그인 페이지
│   │
│   ├── layout.tsx                # 전체 앱 레이아웃
│   ├── page.tsx                  # 메인 랜딩 페이지 (홈)
│   └── globals.css               # 전역 스타일
│
├── components/                   # 재사용 가능한 컴포넌트
│   ├── ui/                       # shadcn/ui 컴포넌트 라이브러리
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── ... (기타 UI 컴포넌트)
│   │
│   ├── contact-form.tsx          # 컨택트 폼 컴포넌트 (next-js-forms에서)
│   ├── login-form.tsx            # 로그인 폼 컴포넌트 (login에서)
│   ├── sidebar.tsx               # 대시보드 사이드바 (admin-dashboard에서)
│   ├── header.tsx                # 대시보드 헤더 (admin-dashboard에서)
│   ├── dashboard-chart.tsx       # 차트 컴포넌트 (admin-dashboard에서)
│   ├── recent-transactions.tsx   # 최근 거래 컴포넌트 (admin-dashboard에서)
│   ├── user-transactions.tsx     # 사용자 거래 컴포넌트 (admin-dashboard에서)
│   ├── create-user-dialog.tsx    # 사용자 생성 다이얼로그 (admin-dashboard에서)
│   ├── sidebar-provider.tsx      # 사이드바 상태 관리 (admin-dashboard에서)
│   └── theme-provider.tsx        # 다크모드 테마 제공자
│
├── coming-soon.tsx               # 메인 랜딩 페이지 컴포넌트
├── lib/                          # 유틸리티 함수
│   └── utils.ts                  # Tailwind 클래스 병합 등
├── hooks/                        # 커스텀 React 훅
├── public/                       # 정적 파일 (이미지, 폰트 등)
├── styles/                       # 추가 스타일 파일
│
├── package.json                  # 프로젝트 의존성 및 스크립트
├── tsconfig.json                 # TypeScript 설정
├── next.config.mjs               # Next.js 설정
├── tailwind.config.js            # Tailwind CSS 설정
├── postcss.config.mjs            # PostCSS 설정
├── components.json               # shadcn/ui 설정
└── README.md                     # 이 파일
```

---

## 🚀 설치 및 실행 방법

### 1️⃣ 사전 요구사항

다음 프로그램들이 설치되어 있어야 합니다:

- **Node.js** (v18 이상 권장)
  - 확인: `node --version`
  - 다운로드: https://nodejs.org/

- **npm** (Node.js와 함께 설치됨)
  - 확인: `npm --version`

### 2️⃣ 프로젝트 위치

프로젝트는 다음 경로에 있습니다:
```
C:\Users\사용자ID\OneDrive\바탕 화면\coming-soon
```

### 3️⃣ 의존성 설치

터미널을 열고 프로젝트 폴더로 이동한 후 의존성을 설치합니다:

```bash
# 프로젝트 폴더로 이동
cd "C:\Users\사용자ID\OneDrive\바탕 화면\coming-soon"

# 의존성 설치 (최초 1회만)
npm install --legacy-peer-deps
```

⚠️ **주의**: `--legacy-peer-deps` 플래그가 필요합니다 (React 19 호환성 문제 해결)

### 4️⃣ 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev
```

실행 후 다음과 같은 메시지가 나타납니다:
```
▲ Next.js 15.2.4
- Local:        http://localhost:3000
- Network:      http://192.168.0.13:3000

✓ Ready in 14.3s
```

💡 **포트 충돌 시**: 3000번 포트가 사용 중이면 자동으로 3001, 3002, 3003... 으로 변경됩니다.

### 5️⃣ 브라우저에서 열기

웹 브라우저에서 다음 주소를 엽니다:
- **로컬 주소**: http://localhost:3000 (또는 터미널에 표시된 포트)

---

## 🌐 페이지 구조 및 라우팅

### 메인 페이지들

| 페이지 | URL | 설명 | 원본 프로젝트 |
|--------|-----|------|---------------|
| **홈/랜딩 페이지** | `/` | Coming Soon 페이지, 카운트다운, Login 버튼 | coming-soon |
| **로그인** | `/login` | 이메일/비밀번호 로그인 폼, Google 로그인 | login |
| **폼** | `/forms` | 컨택트 폼 (연락처 정보 입력) | next-js-forms |
| **대시보드** | `/dashboard/dashboard` | 관리자 대시보드 메인 | admin-dashboard |
| **사용자 관리** | `/dashboard/users` | 사용자 목록 및 관리 | admin-dashboard |
| **설정** | `/dashboard/settings` | 앱 설정 페이지 | admin-dashboard |

### 네비게이션

#### 1. 메인 랜딩 페이지 (`/`)
- **위치**: 화면 우측 상단에 네비게이션 메뉴
- **버튼들**:
  - `Login` → `/login`으로 이동
  - `Forms` → `/forms`로 이동
  - `Dashboard` → `/dashboard`로 이동
- **중앙 Login 버튼**: 큰 Login 버튼 클릭 시 `/login`으로 이동

#### 2. 대시보드 페이지 (`/dashboard/*`)
- **사이드바**: 왼쪽에 고정된 네비게이션
  - Dashboard
  - Users
  - Settings
- **헤더**: 상단에 사용자 정보 및 설정

---

## 🎨 주요 기능

### 1. 랜딩 페이지 (`/`)
- ✅ 카운트다운 타이머 (30일 후까지)
- ✅ Login 버튼 (로그인 페이지 연결)
- ✅ 소셜 미디어 링크 (Twitter, GitHub, LinkedIn, Email)
- ✅ 네비게이션 메뉴 (Login, Forms, Dashboard)
- ✅ 반응형 디자인

### 2. 로그인 페이지 (`/login`)
- ✅ 이메일/비밀번호 입력 폼
- ✅ Google 로그인 버튼
- ✅ "Forgot password" 링크
- ✅ "Sign up" 링크
- ✅ 카드 형식의 깔끔한 UI

### 3. 폼 페이지 (`/forms`)
- ✅ 컨택트 폼
- ✅ 폼 유효성 검사
- ✅ react-hook-form 사용

### 4. 대시보드 (`/dashboard/*`)
- ✅ 사이드바 네비게이션
- ✅ 반응형 레이아웃
- ✅ 차트 및 데이터 시각화 (recharts)
- ✅ 사용자 관리
- ✅ 설정 페이지

---

## 🛠️ 기술 스택

### 프레임워크 & 라이브러리
- **Next.js 15.2.4** - React 프레임워크 (App Router)
- **React 19** - UI 라이브러리
- **TypeScript 5** - 타입 안정성

### UI & 스타일링
- **Tailwind CSS 4.1.9** - 유틸리티 기반 CSS
- **shadcn/ui** - 재사용 가능한 컴포넌트
- **Radix UI** - 접근성 높은 UI 프리미티브
- **Lucide React** - 아이콘 라이브러리

### 폼 & 유효성 검사
- **React Hook Form 7.60.0** - 폼 관리
- **Zod 3.25.76** - 스키마 유효성 검사
- **@hookform/resolvers** - React Hook Form + Zod 통합

### 차트 & 데이터 시각화
- **Recharts 2.15.4** - 차트 라이브러리

### 기타
- **next-themes** - 다크모드 지원
- **date-fns** - 날짜 처리
- **clsx & tailwind-merge** - 클래스 이름 관리

---

## 📝 개발 스크립트

프로젝트에서 사용 가능한 npm 스크립트:

```bash
# 개발 서버 시작 (hot reload 포함)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작 (빌드 후)
npm run start

# ESLint 코드 검사
npm run lint
```

### 개발 워크플로우

1. **개발 시작**:
   ```bash
   npm run dev
   ```
   - 파일 변경 시 자동으로 페이지가 새로고침됩니다
   - TypeScript 타입 에러가 있으면 브라우저에 표시됩니다

2. **코드 품질 검사**:
   ```bash
   npm run lint
   ```
   - ESLint로 코드 스타일 및 잠재적 에러 검사

3. **프로덕션 배포 준비**:
   ```bash
   npm run build
   npm run start
   ```
   - 최적화된 프로덕션 빌드 생성
   - 프로덕션 모드로 서버 실행

---

⚠️ **중요**:
- **작업할 프로젝트**: `coming-soon` 폴더
- **원본 프로젝트들**: 백업용으로 보존 (수정 X)

---

## 📸 페이지 미리보기

### 1. 홈 페이지 (`/`)
- Coming Soon 카운트다운
- Login 버튼 (중앙)
- 네비게이션 메뉴 (우측 상단)
- 소셜 미디어 링크

### 2. 로그인 페이지 (`/login`)
- 이메일 입력
- 비밀번호 입력
- Login 버튼
- Google 로그인 버튼

### 3. 폼 페이지 (`/forms`)
- 컨택트 폼

### 4. 대시보드 (`/dashboard/dashboard`)
- 사이드바 네비게이션
- 차트 및 통계
- 최근 거래 내역

---

## 🐛 문제 해결 (Troubleshooting)

### 1. `npm install` 실패
**문제**: peer dependency 에러
```
npm error ERESOLVE unable to resolve dependency tree
```

**해결책**:
```bash
npm install --legacy-peer-deps
```

### 2. 포트가 이미 사용 중
**문제**: `Port 3000 is in use`

**해결책**:
- Next.js가 자동으로 다른 포트(3001, 3002...)를 찾습니다
- 또는 특정 포트 지정:
  ```bash
  npm run dev -- -p 3005
  ```

### 3. 페이지가 404 에러
**문제**: `/dashboard` 접속 시 404

**해결책**:
- 올바른 URL: `/dashboard/dashboard`
- 또는 `/dashboard/users`, `/dashboard/settings`

### 4. 스타일이 적용되지 않음
**해결책**:
```bash
# 개발 서버 재시작
# Ctrl + C로 중지 후
npm run dev
```

### 5. TypeScript 에러
**해결책**:
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 🔧 커스터마이징 가이드

### 랜딩 페이지 텍스트 변경

**파일**: `coming-soon.tsx` (프로젝트 루트)

```tsx
// 메인 제목 변경 (58-60번째 줄)
<h1 className="text-4xl md:text-6xl font-bold tracking-tight">
  Something Amazing is <span className="text-primary">Coming Soon</span>
</h1>

// 설명 텍스트 변경 (62-64번째 줄)
<p className="text-xl text-muted-foreground max-w-xl mx-auto">
  We're working hard to bring you something extraordinary...
</p>
```

### 카운트다운 기간 변경

**파일**: `coming-soon.tsx`

```tsx
// 22-24번째 줄: 30일 → 원하는 일수로 변경
useEffect(() => {
  const launchDate = new Date()
  launchDate.setDate(launchDate.getDate() + 30) // ← 여기 숫자 변경
  // ...
}, [])
```

### 네비게이션 메뉴 수정

**파일**: `coming-soon.tsx` (58-68번째 줄)

```tsx
<nav className="absolute top-4 right-4 flex gap-4">
  <Link href="/login">
    <Button variant="ghost">Login</Button>
  </Link>
  {/* 새 메뉴 추가 */}
  <Link href="/your-page">
    <Button variant="ghost">New Page</Button>
  </Link>
</nav>
```

---

## 📚 추가 리소스

### 공식 문서
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/

### 커뮤니티
- **Next.js GitHub**: https://github.com/vercel/next.js
- **Stack Overflow**: 태그 `next.js`, `react`, `tailwindcss`

---

## 📞 문의 및 지원

프로젝트 관련 문의사항이 있으시면:
- 이슈 트래커 생성
- 또는 프로젝트 관리자에게 연락

---

## 📄 라이선스

이 프로젝트는 개인 학습 및 개발 목적으로 생성되었습니다.

---

## 🎉 완료!

이제 프로젝트를 실행하고 개발할 준비가 되었습니다!

```bash
cd "C:\Users\사용자 ID\OneDrive\바탕 화면\coming-soon"
npm run dev
```

그리고 브라우저에서 http://localhost:3000 을 열어보세요! 🚀
