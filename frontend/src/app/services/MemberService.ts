import axios, { AxiosInstance } from "axios";
import { serverApi } from "../../lib/config";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../../lib/types/member";

const isFilled = (v: unknown) =>
  v !== undefined && v !== null && String(v).trim() !== "";

class MemberService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: serverApi,
      withCredentials: true, // cookie/session uchun
    });
  }

  /** SIGNUP */
  public async signup(input: MemberInput): Promise<Member> {
    try {
      const { data } = await this.http.post("/member/signup", input);
      const member: Member = data.member ?? data;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      // tashqarida tutib alert ko‘rsatish osonroq bo‘lishi uchun
      throw err;
    }
  }

  /** LOGIN */
  public async login(input: LoginInput): Promise<Member> {
    try {
      const { data } = await this.http.post("/member/login", input);
      const member: Member = data.member ?? data;
      localStorage.setItem("memberData", JSON.stringify(member));
      return member;
    } catch (err) {
      throw err;
    }
  }

  /** GET MEMBER DETAIL */
  public async getMemberDetail(): Promise<Member> {
    try {
      const { data } = await this.http.get("/member/detail");
      return data as Member;
    } catch (err) {
      throw err;
    }
  }

  /** UPDATE MEMBER
   *  - Faqat to‘ldirilgan fieldlarni yuboradi
   *  - Rasm bo‘lsa FormData, bo‘lmasa JSON
   */
  public async updateMember(input: MemberUpdateInput): Promise<Member> {
    try {
      // Faqat to‘ldirilganlarini qoldiramiz
      const clean: Record<string, any> = {};
      Object.entries(input).forEach(([k, v]) => {
        if (isFilled(v)) clean[k] = v;
      });

      const img = clean.memberImage;
      const isFile =
        (typeof File !== "undefined" && img instanceof File) ||
        (typeof Blob !== "undefined" && img instanceof Blob);

      if (isFile) {
        const fd = new FormData();
        Object.entries(clean).forEach(([k, v]) => fd.append(k, v as any));
        const { data } = await this.http.post("/member/update", fd);
        // controller updated member’ni bevosita qaytaradi
        return data as Member;
      } else {
        const { data } = await this.http.post("/member/update", clean, {
          headers: { "Content-Type": "application/json" },
        });
        return data as Member;
      }
    } catch (err) {
      throw err;
    }
  }

  /** LOGOUT */
  public async logout(): Promise<void> {
    try {
      await this.http.post("/member/logout", {});
      localStorage.removeItem("memberData");
    } catch (err) {
      throw err;
    }
  }
}

export default MemberService;
