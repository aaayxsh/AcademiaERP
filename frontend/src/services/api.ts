const API_BASE = (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, '') || '/api';

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('academia_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const headers = { ...this.getHeaders(), ...options.headers };

    let response: Response;
    try {
      response = await fetch(url, { ...options, headers });
    } catch (networkErr: any) {
      console.warn(`[Network Error] API unreachable at ${url}:`, networkErr.message);
      throw new Error(
        'Unable to connect to AcademiaERP server. Please verify the backend API is running on port 5000.'
      );
    }

    let data: any = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (parseErr: any) {
        console.warn(`[JSON Parse Error] Invalid JSON from ${endpoint}:`, parseErr.message);
        throw new Error('Received an invalid response format from the server.');
      }
    } else {
      const rawText = await response.text();
      if (!response.ok) {
        throw new Error(
          rawText.slice(0, 150) || `Server returned error status ${response.status} (${response.statusText})`
        );
      }
      return rawText as unknown as T;
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data as T;
  }

  // Auth Endpoints
  auth = {
    login: (body: any) => this.request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    register: (body: any) => this.request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    requestOtp: (email: string) => this.request<any>('/auth/request-otp', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (body: any) => this.request<any>('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
    getMe: () => this.request<any>('/auth/me'),
  };

  // Student Endpoints
  student = {
    getDashboard: () => this.request<any>('/student/dashboard'),
    getCourses: () => this.request<any>('/student/courses'),
    getAssignments: () => this.request<any>('/student/assignments'),
    submitAssignment: (assignmentId: string, body: any) =>
      this.request<any>(`/student/assignments/${assignmentId}/submit`, { method: 'POST', body: JSON.stringify(body) }),
    getAttendance: () => this.request<any>('/student/attendance'),
    getGamification: () => this.request<any>('/student/gamification'),
    redeemReward: (rewardItemId: string) =>
      this.request<any>('/student/rewards/redeem', { method: 'POST', body: JSON.stringify({ rewardItemId }) }),
  };

  // Faculty Endpoints
  faculty = {
    getDashboard: () => this.request<any>('/faculty/dashboard'),
    getCourses: () => this.request<any>('/faculty/courses'),
    createAssignment: (body: any) => this.request<any>('/faculty/assignments', { method: 'POST', body: JSON.stringify(body) }),
    getSubmissions: (assignmentId: string) => this.request<any>(`/faculty/assignments/${assignmentId}/submissions`),
    gradeSubmission: (submissionId: string, body: any) =>
      this.request<any>(`/faculty/submissions/${submissionId}/grade`, { method: 'POST', body: JSON.stringify(body) }),
    getAttendanceSheet: (courseId: string, date?: string) =>
      this.request<any>(`/faculty/attendance?courseId=${courseId}${date ? `&date=${date}` : ''}`),
    saveAttendanceSheet: (body: any) => this.request<any>('/faculty/attendance', { method: 'POST', body: JSON.stringify(body) }),
    getAiReviewWorkspace: () => this.request<any>('/faculty/ai-review'),
    submitReviewDisposition: (body: any) =>
      this.request<any>('/faculty/ai-review/disposition', { method: 'POST', body: JSON.stringify(body) }),
  };

  // Admin Endpoints
  admin = {
    getDashboard: () => this.request<any>('/admin/dashboard'),
    getUsers: (params: string = '') => this.request<any>(`/admin/users?${params}`),
    createUser: (body: any) => this.request<any>('/admin/users', { method: 'POST', body: JSON.stringify(body) }),
    updateUserStatus: (userId: string, body: any) =>
      this.request<any>(`/admin/users/${userId}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
    getXpRules: () => this.request<any>('/admin/xp-rules'),
    updateXpRule: (ruleId: string, body: any) =>
      this.request<any>(`/admin/xp-rules/${ruleId}`, { method: 'PUT', body: JSON.stringify(body) }),
    getAiGovernance: () => this.request<any>('/admin/ai-governance'),
    getAuditLogs: (params: string = '') => this.request<any>(`/admin/audit-logs?${params}`),
  };

  // Public Endpoints
  public = {
    getStats: () => this.request<any>('/public/stats'),
    getLeaderboard: () => this.request<any>('/public/leaderboard'),
  };
}

export const api = new ApiClient();
