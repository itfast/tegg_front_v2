/* eslint-disable no-undef */
import axios from "axios";
// import moment from 'moment/moment'
import axiosConfig from "../config/axios/axiosConfig";
import { decodeToken } from "react-jwt";
import apiRoutes from "../routes/routing";
import storage from "./storage";

// import {deserializeApiError, ApiInternalServerError} from '../error';

function getDataFromSession(token) {
  const data = {
    user: {},
  };
  if (token) {
    try {
      const decodedToken = decodeToken(token);
      data.user = decodedToken;
    } catch (err) {
      console.debug(err);
    }
  }
  return data;
}

const cleanNumber = (value) => {
  const tmp = value.replace(/[/().\s-]+/g, "");
  return tmp;
};

// const isNumeric = function (value) {
//   const tmp = value.replace(/[/().\s-]+/g, '')
//   return /^\d+(?:\.\d+)?$/.test(tmp)
// }

// function getDataFromStorage() {
//   let data = '';
//   const myStorage = storage.auth.projectDetails;
//   if (storage) {
//     try {
//       // const session = jwt.decode(myStorage);
//       const session = myStorage;
//       data = session;
//     } catch (err) {
//       console.debug(err);
//     }
//   }
//   return data;
// }

function storeSessionData(token) {
  storage.auth.token = token;
}

// function storeProjectData(project) {
//   const dataProject = jwt.sign(project, 'tendus@2021');
//   storage.auth.projectDetails = dataProject;
//   // storage.auth.projectDetails = project;
// }

/**
 * @param {AbortController} cancel
 */
// eslint-disable-next-line no-unused-vars
// function cancelToken(cancel: AbortController) {
//   return new axios.CancelToken((interrupt) => {
//     cancel.signal.addEventListener('abort', (e) => {
//       interrupt(e)
//     })
//   })
// }

function throwFormattedError(error) {
  if (error.response) {
    // eslint-disable-next-line no-unused-vars
    const { data, status } = error.response;
    // console.log("data", data);
    // console.log("status", status);
    // if (status) {
    //   if (status === 401) {
    //     storage.auth.token = null
    //     window.location.href = '/login?code=401'
    //     throw error
    //   }
    // }
    // if (data) {
    //   if (data.code === 'API_ERR_EXPIRED_SESSION_ERROR') {
    //     storage.auth.token = null
    //     window.location.href = '/login?code=401'
    //   }
    //   if (data.status === 401) {
    //     storage.auth.token = null
    //     window.location.href = '/login?code=401'
    //   }
    //   throw error
    // }
  }
  if (error.message === "Network Error") {
    throw error;
  }
  throw error;
}

// function returnText(data) {
//   // let result = data.replaceAll('&', '%26');
//   let result = result.replaceAll('@', '%40');
//   result = result.replaceAll('%', '%25');
//   result = data.replaceAll('&', '%26');
//   return result;
// }
// interface apiInterface {
//   currentSession: string;
// }
class Api {
  constructor() {
    this.myIp = "127.0.0.1";
    const myIp = async () => {
      try {
        const res = await axios.get("https://api.ipify.org/?format=json");
        this.myIp = res?.data?.ip;
      } catch (e) {
        console.error(e);
      }
    };
    this.axios = axios.create(axiosConfig);

    this.currentSession = storage.auth.token;
    const { user } = getDataFromSession(this.currentSession);
    this.currentUser = user;
    // this.currentProject = getDataFromStorage();

    this.currentAuthorizationHeader = this.currentSession
      ? `${this.currentSession}`
      : "";

    this.config = {
      headers: { Authorization: `Bearer ${this.currentAuthorizationHeader}` },
    };

    this.axios.interceptors.request.use((request) => {
      if (this.currentSession) {
        request.headers.Authorization = `Bearer ${this.currentAuthorizationHeader}`;
      }
      request.headers["content-language"] =
        localStorage.getItem("language") || "pt";
      return request;
    });

    myIp();

    const setSession = (token) => {
      this.currentSession = token;
      this.currentAuthorizationHeader = token;
      // this.currentAuthorizationHeader = token ? `Bearer ${token}` : ''
      // this.config = {
      //   headers: { Authorization: this.currentAuthorizationHeader },
      // }
      const result = getDataFromSession(token);
      this.currentUser = result.user;

      storeSessionData(token);
    };

    // eslint-disable-next-line no-unused-expressions
    // this.language = {
    //   set: async (language) => {
    //     // storage.auth.language = language;
    //     localStorage.setItem('language', language)
    //     return 'ok'
    //   },
    //   get: async () => localStorage.getItem('language'),
    // }

    this.mySession = {
      set: async (token) => {
        try {
          setSession(token);
          return "ok";
        } catch (e) {
          return throwFormattedError(e);
        }
      },
    };

    // this.myIp = {
    //   get: async () => {
    //     const res = await axios.get('https://api.ipify.org/?format=json');
    //     console.log(res.data);
    //   },
    // };

    this.plans = {
      get: async (option) => {
        const query = option ? `?DealerId=${option}` : "";
        try {
          const response = await this.axios.get(`${apiRoutes.plan}${query}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getByRecharge: async () => {
        const query = "?Type=RECHARGE";
        try {
          const response = await this.axios.get(`${apiRoutes.plan}${query}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getByBuy: async (buyer, dealer) => {
        const query =
          buyer === "client" ? "&FinalClientCanBuy=true" : "&DealerCanBuy=true";
        const queryCan = dealer ? `&DealerId=${dealer}` : "";
        try {
          const response = await this.axios.get(
            `${apiRoutes.plan}?Type=BUY${query}${queryCan}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      new: async (plan, prodList) => {
        try {
          const response = await this.axios.post(`${apiRoutes.plan}`, {
            Duration: Number(plan.Duration),
            Amount: Number(plan.Amount),
            EarningsCeiling: Number(plan.EarningsCeiling),
            MaximumInvestment: Number(plan.MaximumInvestment),
            MinimumInvestment: Number(plan.MinimumInvestment),
            Name: plan.Name,
            Performance: Number(plan.Performance),
            PointsForCarrerPlan: Number(plan.PointsForCarrerPlan),
            Products: prodList,
            Type: plan.Type,
            Size: plan.Size,
            Internet: plan.Internet,
            Extra: plan.Extra,
            Free: plan.Free,
            DealerCanBuy: plan.DealerCanBuy,
            FinalClientCanBuy: plan.FinalClientCanBuy,
            Comments: plan.Comments,
            ExtraPortIn: plan.ExtraPortIn,
            OnlyInFirstRecharge: plan.OnlyInFirstRecharge,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      edit: async (id, plan, prodList) => {
        try {
          const response = await this.axios.put(`${apiRoutes.plan}/${id}`, {
            Duration: Number(plan.Duration),
            Amount: Number(plan.Amount),
            EarningsCeiling: Number(plan.EarningsCeiling),
            MaximumInvestment: Number(plan.MaximumInvestment),
            MinimumInvestment: Number(plan.MinimumInvestment),
            Name: plan.Name,
            Performance: Number(plan.Performance),
            PointsForCarrerPlan: Number(plan.PointsForCarrerPlan),
            Products: prodList,
            Type: plan.Type,
            Size: plan.Size,
            Internet: plan.Internet,
            Extra: plan.Extra,
            Free: plan.Free,
            DealerCanBuy: plan.DealerCanBuy,
            FinalClientCanBuy: plan.FinalClientCanBuy,
            Comments: plan.Comments,
            ExtraPortIn: plan.ExtraPortIn,
            OnlyInFirstRecharge: plan.OnlyInFirstRecharge,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      delete: async (id) => {
        console.log(id);
        try {
          const response = await this.axios.delete(`${apiRoutes.plan}/${id}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
    this.iccid = {
      getlpaqrcode: async (iccid) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/getlpaqrcode/${iccid} `,
            { responseType: "blob" }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getAll: async (pageNum, pageSize) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}?limit=${pageSize}&page=${pageNum}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getAllTeste: async (
        pageNum,
        pageSize,
        status,
        iccid,
        type = "",
        stoke = ""
      ) => {
        const queryStoke = stoke === "" ? "" : `&stock=${stoke}`;
        const queryType = type === "" ? "" : `&type=${type}`;
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}?limit=${pageSize}&page=${pageNum}&status=${status}&Iccid=${iccid}${queryStoke}${queryType}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      checkFree: async (type, stock) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/checkFree?type=${type}&stock=${stock}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getByStatus: async (pageNum, pageSize, status) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}?limit=${pageSize}&page=${pageNum}&status=${status}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getSome: async (pageNum, pageSize, iccid) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}?limit=${pageSize}&page=${pageNum}&Iccid=${iccid}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },

      getSome1: async (pageNum, pageSize, iccid, type, status) => {
        try {
          let query = "";
          if (type) {
            query = `&type=${type}`;
          }
          console.log(
            `${apiRoutes.iccid}/available?limit=${pageSize}&page=${pageNum}&Iccid=${iccid}&status=${status}${query}`
          );
          const response = await this.axios.get(
            `${apiRoutes.iccid}/available?limit=${pageSize}&page=${pageNum}&Iccid=${iccid}&status=${status}${query}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },

      create: async (iccid, url, withSpeedFlow) => {
        // console.log("ICCID", iccid);
        try {
          const response = await this.axios.post(`${apiRoutes.iccid}/`, {
            Iccid: iccid,
            WithSpeedFlow: withSpeedFlow,
            DealerId: null,
            LPAUrl: url || null,
          });
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      edit: async (Iccid) => {
        try {
          console.log(Iccid, Iccid.FinalClientId);
          const res = await this.axios.put(
            `${apiRoutes.iccid}/${Iccid.Iccid}`,
            {
              FinalClientId: Iccid.FinalClientId || "",
              DealerId: Iccid.DealerId || "",
              Type: Iccid.Type,
              LPAUrl: Iccid.LPAUrl || "",
            }
          );
          return res;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      activate: async (iccid, plan, document, ddd) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/${iccid}/active`,
            {
              PlanId: plan,
              Document: document,
              Ddd: ddd,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      changeChip: async (iccid, newIccid, userDocument) => {
        try {
          const response = await this.axios.post(`${apiRoutes.iccid}/change`, {
            iccid,
            newIccid,
            userDocument,
          });
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      payAndActivate: async (
        iccid,
        plan,
        document,
        ddd,
        PaymentType,
        CreditCard,
        CreditCardHolderInfo,
        token,
        FinalClientId
      ) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.order}/rechargeactive`,
            {
              SurfId: plan,
              CpfCnpj: document,
              Ddd: ddd,
              ICCID: iccid,
              PaymentType,
              CreditCard: token ? null : CreditCard,
              CreditCardHolderInfo: token ? null : CreditCardHolderInfo,
              CreditCardToken: token,
              ClientIp: this.myIp,
              FinalClientId,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      bindToDealer: async (dealerId, paymentId, idList) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/linkdealer/${dealerId}`,
            {
              PaymentId: paymentId,
              IccidList: idList,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      delete: async (iccid) => {
        try {
          const response = await this.axios.delete(
            `${apiRoutes.iccid}/${iccid}`
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      block: async (iccid) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/blockUnblock/${iccid}`,
            {
              chip: "bloquear",
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      unblock: async (iccid) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/blockUnblock/${iccid}`,
            {
              chip: "desbloquear",
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      cancel: async (iccid) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/cancel/${iccid}`
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      surfStatus: async (iccid, type) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/check/${iccid}?type=${type}`
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      getXls: async () => {
        try {
          const response = await this.axios.get(`${apiRoutes.iccid}/xls`, {
            responseType: "blob",
          });
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      getXlsByStatus: async (status) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/xls?status=${status}`,
            {
              responseType: "blob",
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      sendXls: async (formData) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/file`,
            formData
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      getBalance: async (id) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/balance/${id}`
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      updateOrderItem: async (orderItem, iccidList) => {
        try {
          const response = await this.axios.put(
            `${apiRoutes.iccid}/update/${orderItem}`,
            {
              Iccid: iccidList,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      getTotals: async (date) => {
         const query = date ? `?date=${date.toISOString()}` : ''
        try {
          const response = await this.axios.get(`${apiRoutes.iccid}/totals${query}`);
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      getDealerTotals: async (dealerId) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/totals/${dealerId}`
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      createSubscription: async (
        finalClientId,
        amount,
        dueDate,
        creditCardInfo,
        creditCardHolderInfo,
        surfPlan,
        iccid
      ) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/subscription`,
            {
              FinalClientId: finalClientId,
              Amount: amount,
              DueDate: dueDate,
              CreditCardInfo: creditCardInfo,
              CreditCardHolderInfo: creditCardHolderInfo,
              SurfPlan: surfPlan,
              Iccid: iccid,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      createSubscriptionTv: async (
        finalClientId,
        amount,
        dueDate,
        creditCardInfo,
        creditCardHolderInfo,
        PlayHubPlan
      ) => {
        console.log({
          FinalClientId: finalClientId,
          Amount: amount,
          DueDate: dueDate,
          CreditCardInfo: creditCardInfo,
          CreditCardHolderInfo: creditCardHolderInfo,
          PlayHubPlan: PlayHubPlan,
          ClientIp: this.myIp,
        });
        try {
          const response = await this.axios.post(
            `${apiRoutes.playHub}/payment/subscription`,
            {
              FinalClientId: finalClientId,
              Amount: amount,
              DueDate: dueDate,
              CreditCardInfo: creditCardInfo,
              CreditCardHolderInfo: creditCardHolderInfo,
              PlayHubPlan: PlayHubPlan,
              ClientIp: this.myIp,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      updateSubscription: async (id, DueDate, Amount, SurfPlan) => {
        try {
          const response = await this.axios.put(
            `${apiRoutes.iccid}/subscription/${id}`,
            {
              Amount,
              SurfPlan,
              DueDate,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      updateSubscriptionDueDate: async (id, dueDate) => {
        try {
          const response = await this.axios.put(
            `${apiRoutes.iccid}/subscription/date/${id}`,
            {
              DueDate: dueDate,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      updateSubscriptionPlan: async (id, amount, surfPlan) => {
        try {
          const response = await this.axios.put(
            `${apiRoutes.iccid}/subscription/plan/${id}`,
            {
              Amount: amount,
              SurfPlan: surfPlan,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      updateSubscriptionStatus: async (id) => {
        try {
          const response = await this.axios.put(
            `${apiRoutes.iccid}/subscription/status/${id}`,
            {
              DueDate: dueDate,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      cancelSubscription: async (id) => {
        try {
          const response = await this.axios.delete(
            `${apiRoutes.iccid}/subscription/${id}`
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      getSubscriptions: async (pageNum, pageSize) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/subscription?page=${pageNum}&limit=${pageSize}`
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      link: async (DealerId, FinalClientId, Iccid) => {
        try {
          const response = await this.axios.put(
            `${apiRoutes.iccid}/linkdealerfinalclient`,
            {
              Iccid,
              DealerId,
              FinalClientId,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
    };
    this.streaming = {
      addPlan: async (Username, ProductId) => {
        console.log("addplan");
        try {
          const response = await this.axios.post(
            `${apiRoutes.playHub}/subscription`,
            {
              Username,
              ProductId,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      removePlan: async (Username, ProductId) => {
        try {
          const response = await this.axios.delete(
            `${apiRoutes.playHub}/subscription/${Username}/product/${ProductId}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      newUser: async (
        Username,
        Document,
        Password,
        Name,
        Email,
        Mobile,
        UserId
      ) => {
        console.log(Username, Document, Password, Name, Email, Mobile, UserId);
        try {
          const response = await this.axios.post(
            `${apiRoutes.playHub}/customer`,
            {
              UserId,
              Username,
              Document,
              Password,
              Name,
              Email,
              Mobile,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      updateUser: async (Username, Password, Name, Email, Mobile) => {
        console.log({
          Password,
          Name,
          Email,
          Mobile,
        });
        try {
          const response = await this.axios.put(
            `${apiRoutes.playHub}/customer/${Username}`,
            {
              Password,
              Name,
              Email,
              Mobile,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getAll: async (search, page, limit) => {
        try {
          // ${api.currentUser.Email}
          const query = search === "" ? "" : `&search=${search}`;
          const response = await this.axios.get(
            `${apiRoutes.playHub}/customer?limit=${limit}&page${page}${query}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      myStreams: async () => {
        try {
          // ${api.currentUser.Email}
          const response = await this.axios.get(
            `${apiRoutes.playHub}/subscription/${api.currentUser.Email}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      userStreams: async (login) => {
        try {
          // ${api.currentUser.Email}
          const response = await this.axios.get(
            `${apiRoutes.playHub}/subscription/${login}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
    this.settings = {
      get: async () => {
        try {
          const response = await this.axios.get(`${apiRoutes.settings}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      update: async (key, SettingValue) => {
        try {
          const response = await this.axios.patch(
            `${apiRoutes.settings}/${key}`,
            {
              SettingValue,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
    this.tutorials = {
      delete: async (Id) => {
        try {
          const response = await this.axios.delete(
            `${apiRoutes.tutorials}/${Id}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getAll: async (pageNum, pageSize, status) => {
        const query = status ? `&status=${status}` : "";
        try {
          const response = await this.axios.get(
            `${apiRoutes.tutorials}?page=${pageNum}&limit=${pageSize}${query}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      new: async (title, description, videoUrl) => {
        try {
          const response = await this.axios.post(`${apiRoutes.tutorials}`, {
            Title: title,
            Description: description,
            URL: videoUrl,
            Status: "Publicado",
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      edit: async (id, title, description, videoUrl, status) => {
        console.log(id, title, description, videoUrl, status);
        try {
          const response = await this.axios.put(
            `${apiRoutes.tutorials}/${id}`,
            {
              Title: title,
              Description: description,
              URL: videoUrl,
              Status: status,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
    this.client = {
      delete: async (Id) => {
        try {
          const response = await this.axios.delete(`${apiRoutes.client}/${Id}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getAll: async (pageNum, pageSize, search, dealer, type) => {
        // console.log(
        //   `${apiRoutes.client}?page=${pageNum}&limit=${pageSize}&search=${search}&dealer=${dealer}`
        // );
        let queryType = "";
        if (type) {
          if (type?.value !== "") {
            queryType = `&type=${type.value}`;
          }
        }
        try {
          const response = await this.axios.get(
            `${apiRoutes.client}?page=${pageNum}&limit=${pageSize}&search=${search}&dealer=${dealer}${queryType}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      // http://localhost:4000/api/iccid/changelinedocument?page=1&limit=10
      getDocPorts: async (pageNum, pageSize, search, type) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/changelinedocument?page=${pageNum}&limit=${pageSize}&search=${search}&type=${type}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      changeDoc: async (Msisdn, Document, Iccid) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/changelinedocument`,
            {
              Msisdn,
              Document,
              Iccid,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getDeleteds: async (pageNum, pageSize, search, type) => {
        try {
          const response = await this.axios.get(
            `/deletedusers?page=${pageNum}&limit=${pageSize}&search=${search}&type=${type}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getSome: async (pageNum, pageSize, client) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.client}?page=${pageNum}&limit=${pageSize}&search=${client}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getSomeAgent: async (pageNum, pageSize, client) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.client}/agent?page=${pageNum}&limit=${pageSize}&search=${client}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getById: async (id) => {
        try {
          const response = await this.axios.get(`${apiRoutes.client}/${id}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getInfo: async (cpf) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.client}/details/${cpf}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getAddress: async (id) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.client}/address/${id}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getAddress1: async (id) => {
        console.log(id);
        try {
          const response = await this.axios.get(`${apiRoutes.client}/${id}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getByDealer: async (id, pageNum, pageSize) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.client}/dealer/${id}?page=${pageNum}&limit=${pageSize}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getTotals: async (date) => {
        try {
           const query = date ? `?date=${date.toISOString()}` : ''
          const response = await this.axios.get(`${apiRoutes.client}/totals${query}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getTotalsDealer: async (DealerId) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.client}/totals/${DealerId}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      new: async (client, type, dealer, address, userLegacy) => {
        // console.log(client, type, dealer, address, userLegacy);

        try {
          const response = await this.axios.post(`${apiRoutes.client}`, {
            Cnpj: type === "PESSOA JURÍDICA" ? cleanNumber(client.cnpj) : null,
            Ie: type === "PESSOA JURÍDICA" ? client.ie : null,
            Name: client.name,
            Cpf: type === "PESSOA FISICA" ? cleanNumber(client.cpf) : null,
            Rg: type === "PESSOA FISICA" ? client.rg : null,
            Birthday: client.date,
            Email: client.email,
            SecondEmail: client.secondEmail,
            Mobile: client.phone,
            Whatsapp: client.whatsApp,
            PostalCode: address.cep,
            StreetName: address.address,
            State: address.uf,
            City: address.city,
            District: address.district,
            Number: address.number,
            Complement: address.complement,
            Type: type === "PESSOA FISICA" ? "PF" : "PJ",
            ICMSContributor: client.icmsContributor ? 1 : 0,
            DealerId:
              api.currentUser.AccessTypes[0] === "TEGG"
                ? dealer?.value
                : api.currentUser.DealerId,
            IdLegacySystem: userLegacy?.value ? userLegacy?.value : null,
            IsAgent: client?.isAgent,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      newPreregistration: async (client, company, type, bank, Id, Password) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.preregistration}`,
            {
              Id,
              Name: client.name,
              Cpf: client.cpf && cleanNumber(client.cpf),
              Rg: client.rg,
              Birthday: client.date,
              Email: client.email,
              SecondEmail: client.secondEmail,
              Mobile: client.phone && cleanNumber(client.phone),
              Whatsapp: client.whatsApp && cleanNumber(client.whatsApp),
              PostalCode: client.cep,
              StreetName: client.address,
              State: client.uf,
              City: client.city,
              District: client.district,
              Number: client.number,
              Complement: client.complement,
              Type: type,
              CompanyName: company?.name,
              Cnpj: company?.cnpj
                ? company?.cnpj && cleanNumber(company?.cnpj)
                : client?.cnpj && cleanNumber(client?.cnpj),
              Ie: company?.ie || client?.ie,
              Im: "",
              ICMSContributor: 1,
              CompanyEmail: company?.email,
              CompanyMobile: company?.phone && cleanNumber(company?.phone),
              CompanyPostalCode: company?.cep,
              CompanyStreetName: company?.address,
              CompanyState: company?.uf,
              CompanyCity: company?.city,
              CompanyDistrict: company?.district,
              CompanyNumber: company?.number,
              CompanyComplement: company?.complement,
              PixKeyType: bank?.type,
              PixKey: bank?.pixKey,
              Bank: bank?.bankName,
              BranchNumber: bank?.ag,
              BranchVerifier: bank?.agDigit,
              AcountNumber: bank?.account,
              AccountNumberVerifier: bank?.accountDigit,
              Operation: bank?.op,
              Password,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getPreregistration: async (pageNum, pageSize, search, status) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.preregistration}?page=${pageNum}&limit=${pageSize}&search=${search}&status=${status}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      resendEmailPreregistration: async (Email, Id) => {
        console.log(Email, Id);
        try {
          const response = await this.axios.post(
            `${apiRoutes.preregistration}/resendemail`,
            {
              Email,
              Id,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getPreregistrationId: async (Id) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.preregistration}/${Id}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getPreregistrationIdExtern: async (Id, token) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.preregistration}/${Id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      updateStatusPreregistration: async (Id, Status, Comments) => {
        try {
          const response = await this.axios.patch(
            `${apiRoutes.preregistration}/${Id}/status`,
            {
              Status,
              Comments,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      edit: async (client, type, dealer, address, userLegacy) => {
        console.log("vamos editar");
        try {
          console.log({
            Cnpj: type === "PESSOA JURÍDICA" ? cleanNumber(client.cnpj) : null,
            Ie: type === "PESSOA JURÍDICA" ? client.ie : null,
            Name: client.name,
            Cpf: type === "PESSOA FISICA" ? cleanNumber(client.cpf) : null,
            Rg: type === "PESSOA FISICA" ? client.rg : null,
            Birthday: client.date,
            Email: client.email,
            SecondEmail: client.secondEmail,
            Mobile: cleanNumber(client.phone),
            Whatsapp: cleanNumber(client.whatsApp),
            PostalCode: address.cep,
            StreetName: address.address,
            State: address.uf,
            City: address.city,
            District: address.district,
            Number: address.number,
            Complement: address.complement,
            Type: type === "PESSOA FISICA" ? "PF" : "PJ",
            ICMSContributor: client.icmsContributor ? 1 : 0,
            DealerId:
              api.currentUser.AccessTypes[0] === "TEGG"
                ? dealer?.value
                : api.currentUser.DealerId,
            IdLegacySystem: userLegacy?.value ? userLegacy?.value : null,
            IsAgent: client?.isAgent,
          });
          const response = await this.axios.put(
            `${apiRoutes.client}/${client.id}`,
            {
              Cnpj:
                type === "PESSOA JURÍDICA" ? cleanNumber(client.cnpj) : null,
              Ie: type === "PESSOA JURÍDICA" ? client.ie : null,
              Name: client.name,
              Cpf: type === "PESSOA FISICA" ? cleanNumber(client.cpf) : null,
              Rg: type === "PESSOA FISICA" ? client.rg : null,
              Birthday: client.date,
              Email: client.email,
              SecondEmail: client.secondEmail,
              Mobile: cleanNumber(client.phone),
              Whatsapp: cleanNumber(client.whatsApp),
              PostalCode: address.cep,
              StreetName: address.address,
              State: address.uf,
              City: address.city,
              District: address.district,
              Number: address.number,
              Complement: address.complement,
              Type: type === "PESSOA FISICA" ? "PF" : "PJ",
              ICMSContributor: client.icmsContributor ? 1 : 0,
              DealerId:
                api.currentUser.AccessTypes[0] === "TEGG"
                  ? dealer?.value
                  : api.currentUser.DealerId,
              IdLegacySystem: userLegacy?.value ? userLegacy?.value : null,
              IsAgent: client?.isAgent,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
    this.order = {
      getAll: async (pageNum, pageSize, search, iccid, status, mfreight) => {
        const query = status === "" ? "" : `&status=${status}`;
        const freight = mfreight === "" || typeof mfreight === "undefined" ? "" : `&freight=${mfreight}`;
        const searchh = search === "" ? "" : `&search=${search}`;
        const iccidd = iccid === "" ? "" : `&iccid=${iccid}`
        console.log( `${apiRoutes.order}?page=${pageNum}&limit=${pageSize}${searchh}${iccidd}${query}${freight}`)
        try {
          const response = await this.axios.get(
            `${apiRoutes.order}?page=${pageNum}&limit=${pageSize}${searchh}${iccidd}${query}${freight}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getByRoot: async (
        pageNum,
        pageSize,
        search,
        status,
        mfreight,
        IccidId
      ) => {
        const query = status === "" ? "" : `&status=${status}`;
        const freight = mfreight === "" ? "" : `&freight=${mfreight}`;
        const searchh = search === "" ? "" : `&search=${search}`;
        console.log(`${apiRoutes.order}/root/${IccidId}?page=${pageNum}&limit=${pageSize}${searchh}${query}${freight}`)
        try {
          const response = await this.axios.get(
            `${apiRoutes.order}/root/${IccidId}?page=${pageNum}&limit=${pageSize}${searchh}${query}${freight}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getById: async (id) => {
        try {
          const response = await this.axios.get(`${apiRoutes.order}/${id}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getAllMetrics: async (date) => {
        try {
          const query = date ? `?date=${date.toISOString()}` : ''
          const response = await this.axios.get(
            `${apiRoutes.order}/get/metrics${query}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getDealerMetrics: async (dealerId) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.order}/get/metrics/${dealerId}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getFinalClientMetrics: async (finalClientId) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.order}/get/metrics/client/${finalClientId}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getSome: async (pageNum, pageSize, search) => {
        console.log(
          `${apiRoutes.order}?page=${pageNum}&limit=${pageSize}&search=${search}`
        );
        try {
          const response = await this.axios.get(
            `${apiRoutes.order}?page=${pageNum}&limit=${pageSize}&search=${search}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getByStatus: async (pageNum, pageSize, status) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.order}?page=${pageNum}&limit=${pageSize}&status=${status}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getStatus: async (id) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.order}/example/status/${id}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getDealerOrders: async (pageNum, pageSize) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.order}/dealer/payer?page=${pageNum}&limit=${pageSize}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      // create: async (
      //   ClientId,
      //   DealerPayedId,
      //   DealerId,
      //   Type,
      //   HaveFreight,
      //   FreightAmount,
      //   Address
      // ) => {
      //   try {
      //     const response = await this.axios.post(`${apiRoutes.order}/`, {
      //       FinalClientId: ClientId,
      //       DealerId: DealerId,
      //       DealerPayerId: DealerPayedId,
      //       Type: Type,
      //       HaveFreight: HaveFreight,
      //       FreightAmount: FreightAmount,
      //       FreightStreetName:
      //         Address?.address !== '' ? Address?.address : null,
      //       FreightState: Address?.uf !== '' ? Address?.uf : null,
      //       FreightCity: Address?.city !== '' ? Address?.city : null,
      //       FreightDistrict:
      //         Address?.district !== '' ? Address?.district : null,
      //       FreightNumber: Address?.number !== '' ? Address?.number : null,
      //       FreightComplement:
      //         Address?.complement !== '' ? Address?.complement : null,
      //       FreightPostalCode: Address?.cep !== '' ? Address?.cep : null,
      //     });
      //     return response;
      //   } catch (e) {
      //     throwFormattedError(e);
      //   }
      // },
      transport: async (OrderId) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.order}/sendiccid `,
            {
              OrderId,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      linkiccid: async (OrderItemId, iccids) => {
        const Iccids = [];
        iccids.forEach((i) => {
          Iccids.push(i.value);
        });
        try {
          const response = await this.axios.post(
            `${apiRoutes.order}/linkiccid`,
            {
              OrderItemId,
              Iccids,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      create: async (
        ClientId,
        DealerId,
        Type,
        HaveFreight,
        FreightAmount,
        Address,
        Automatic
      ) => {
        try {
          const response = await this.axios.post(`${apiRoutes.order}/`, {
            FinalClientId: ClientId,
            DealerId: DealerId,
            Type: Type,
            HaveFreight: HaveFreight,
            FreightAmount: FreightAmount,
            FreightStreetName:
              Address?.address !== "" ? Address?.address : null,
            FreightState: Address?.uf !== "" ? Address?.uf : null,
            FreightCity: Address?.city !== "" ? Address?.city : null,
            FreightDistrict:
              Address?.district !== "" ? Address?.district : null,
            FreightNumber: Address?.number !== "" ? Address?.number : null,
            FreightComplement:
              Address?.complement !== "" ? Address?.complement : null,
            FreightPostalCode: Address?.cep !== "" ? Address?.cep : null,
            Automatic,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      sendReceipt: async (file, orderId) => {
        const formData = new FormData();
        formData.append("doc", file);
        formData.append("PurchaseOrderId", orderId);
        try {
          const response = await this.axios.post(
            `${apiRoutes.purchaseorder}/sendreceipt`,
            formData
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },

      sendReceiptOrder: async (file, orderId) => {
        const formData = new FormData();
        formData.append("doc", file);
        formData.append("OrderId", orderId);
        try {
          const response = await this.axios.post(
            `${apiRoutes.order}/sendreceipt`,
            formData
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      paymentMoney: async (Id, Value) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.payment}/receiveincash`,
            {
              Id,
              PaymentDate: new Date(),
              NotifyCustomer: true,
              Value,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      deletePayment: async (Id) => {
        console.log(Id);
        try {
          const response = await this.axios.delete(
            `${apiRoutes.payment}/${Id}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      deletePaymentExtern: async (Id) => {
        try {
          const response = await this.axios.delete(
            `${apiRoutes.payment}/${Id}`,
            {
              headers: {
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoiRmVsaXBlIE1hY2hhZG8iLCJVc2VySWQiOiJkYjgzYTY2Ny1iNTU0LTQyMzUtOTkzOC1hYTU0NjQyMWEwODgiLCJUeXBlIjoiVEVHRyIsIkRlYWxlcklkIjpudWxsLCJFbWFpbCI6ImZlbGlwZUBpdGZhc3QuY29tLmJyIiwiQ3JlYXRlZEF0IjoiMjAyMy0xMS0yNFQyMToxMDowMS45NjNaIiwiTGFzdFNpZ24iOiIyMDI0LTAxLTE5VDEzOjMzOjUyLjgwNloiLCJBY2Nlc3NUeXBlcyI6WyJURUdHIl0sIklkTGVnYWN5U3lzdGVtIjo0NzUzLCJpYXQiOjE3MDU2NzEyMzJ9.QQva_UQcCCA1U_TgX08LBRjvBLygs1Zzy5D-xB4FRrc",
              },
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      refundPayment: async (Id) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.payment}/refund`,
            {
              Id,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getStatement: async (limit, page, status, find) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.payment}?limit=${limit}&page=${page}&status=${status}&search=${find}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      addItem: async (
        PlanId,
        Quantity,
        OrderId,
        Amount,
        Iccids,
        QuantityEsim,
        QuantitySimCard,
        PortIn,
        FinalClientId,
        DealerId,
        ActivationDdd,
        ActivationDoc,
        Mobile,
        MobileOperator,
        UserDoc,
        PortName
      ) => {
        try {
          const response = await this.axios.post(`${apiRoutes.order}/item`, {
            PlanId: PlanId,
            Quantity: Quantity,
            OrderId: OrderId,
            Amount: Number(Amount),
            Iccids: Iccids,
            QuantityEsim,
            QuantitySimCard,
            PortIn,
            FinalClientId,
            DealerId,
            ActivationDdd,
            ActivationDoc,
            Mobile,
            MobileOperator,
            UserDoc,
            PortName,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      addPlan: async (OrderId, doc) => {
        const formData = new FormData();
        formData.append("OrderId", OrderId);
        formData.append("doc", doc);
        try {
          const response = await this.axios.post(
            `${apiRoutes.order}/file`,
            formData
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      onlyRecharge: async (Phone, SurfId) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.order}/only/recharge`,
            {
              Phone,
              SurfId,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getInfo: async (id) => {
        try {
          const response = await this.axios.get(`${apiRoutes.order}/${id}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      pay: async (OrderId, PaymentType, card, address, token) => {
        let CreditCard = null;
        let CreditCardHolderInfo = null;

        if (!token) {
          CreditCard = {
            holderName: card?.name,
            number: card?.number,
            expiryMonth: card?.expiry?.slice(0, 2),
            expiryYear: card?.expiry?.slice(3, 7),
            ccv: card.cvc,
          };

          CreditCardHolderInfo = {
            name: address.name,
            email: address.email,
            cpfCnpj: address.document && cleanNumber(address.document),
            postalCode: address.cep && cleanNumber(address.cep),
            addressNumber: address.number,
            addressComplement: address.complement,
            phone: address.mobile && cleanNumber(address.mobile),
            mobilePhone: address.mobile && cleanNumber(address.mobile),
          };
        }

        try {
          const response = await this.axios.post(`${apiRoutes.order}/pay`, {
            OrderId,
            PaymentType,
            CreditCard,
            CreditCardHolderInfo,
            CreditCardToken: token,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      payCredit: async (
        id,
        amount,
        holderName,
        number,
        month,
        year,
        ccv,
        name,
        email,
        cpfCnpj,
        postalCode,
        addressNumber,
        addressComplement,
        phone,
        mobile,
        token
      ) => {
        let CreditCard = null;
        let CreditCardHolderInfo = null;

        if (!token) {
          CreditCard = {
            holderName: holderName,
            number: number,
            expiryMonth: month,
            expiryYear: year,
            ccv: ccv,
          };
          CreditCardHolderInfo = {
            name: name,
            email: email,
            cpfCnpj: cpfCnpj,
            postalCode: postalCode,
            addressNumber: addressNumber,
            addressComplement: addressComplement,
            phone: phone,
            mobilePhone: mobile,
          };
        }

        try {
          const response = await this.axios.post(`${apiRoutes.order}/pay`, {
            OrderId: id,
            PaymentType: "CREDITO",
            Amount: amount,
            ClientIp: this.myIp,
            CreditCard,
            CreditCardHolderInfo,
            CreditCardToken: token,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      payPix: async (id, amount) => {
        try {
          const response = await this.axios.post(`${apiRoutes.order}/pay`, {
            OrderId: id,
            PaymentType: "PIX",
            Amount: amount,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      payBoleto: async (id, amount) => {
        try {
          const response = await this.axios.post(`${apiRoutes.order}/pay`, {
            OrderId: id,
            PaymentType: "BOLETO",
            Amount: amount,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      payGetLink: async (OrderId) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.order}/verify/payment`,
            {
              OrderId,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      resendEmail: async (OrderId, Email) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.order}/payment/sendemail`,
            {
              OrderId,
              Email,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      sendIccids: async (orderId, idList, clientId, planId, doc, ddd) => {
        // console.log(idList, clientId, planId, doc, ddd);
        try {
          const response = await this.axios.post(
            `${apiRoutes.order}/sendIccids`,
            {
              OrderId: orderId,
              IccidsList: idList,
              FinalClientId: clientId,
              PlanId: planId,
              Document: doc,
              Ddd: ddd,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      calculateFreight: async (realWeight, totalWeight, amount, postalCode) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.order}/freight/calculate`,
            {
              RealWeight: realWeight,
              TotalWeight: totalWeight,
              Amount: amount,
              PostalCode: postalCode,
            }
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      checkFreightStatus: async (orderId) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.order}/freight/status/${orderId}`
          );
          return response;
        } catch (e) {
          // console.log(e);
          throwFormattedError(e);
        }
      },
      resendFreightOrder: async (orderId) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.order}/freight/resend/${orderId}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
    this.purchaseorder = {
      create: async (FinalClientId, DealerId, address) => {
        console.log("create order", FinalClientId, DealerId, address);
        try {
          const response = await this.axios.post(`${apiRoutes.purchaseorder}`, {
            FinalClientId,
            DealerId,
            FreightStreetName: address.address,
            FreightState: address.uf,
            FreightCity: address.city,
            FreightDistrict: address.district,
            FreightNumber: address.number,
            FreightComplement: address.complement,
            FreightPostalCode: address.cep,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      addItem: async (
        Quantity,
        PurchaseOrderId,
        PlanId,
        QuantityEsim,
        QuantitySimCard,
        PortIn,
        Mobile,
        MobileOperator,
        UserDoc
      ) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.purchaseorder}/item`,
            {
              Quantity,
              PurchaseOrderId,
              PlanId,
              QuantityEsim,
              QuantitySimCard,
              PortIn,
              Mobile,
              MobileOperator,
              UserDoc,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      pay: async (PurchaseOrderId, PaymentType, card, address) => {
        const CreditCard = {
          holderName: card?.name,
          number: card?.number,
          expiryMonth: card?.expiry?.slice(0, 2),
          expiryYear: card?.expiry?.slice(3, 7),
          ccv: card.cvc,
        };

        const CreditCardHolderInfo = {
          name: address.name,
          email: address.email,
          cpfCnpj: address.document,
          postalCode: address.cep,
          addressNumber: address.number,
          addressComplement: address.complement,
          phone: address.mobile,
          mobilePhone: address.mobile,
        };
        try {
          const response = await this.axios.post(
            `${apiRoutes.purchaseorder}/pay`,
            {
              PurchaseOrderId,
              PaymentType,
              CreditCard,
              CreditCardHolderInfo,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getStatus: async (id) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.purchaseorder}/status/${id}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getAll: async (page, limit, search, status) => {
        console.log(page, limit, search, status);
        try {
          const response = await this.axios.get(
            `${apiRoutes.purchaseorder}?page=${page}&limit=${limit}&search=${search}&status=${status}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getById: async (id) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.purchaseorder}/${id}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      linkiccid: async (PurchaseOrderItemId, iccids) => {
        const Iccids = [];
        iccids.forEach((i) => {
          Iccids.push(i.value);
        });
        try {
          const response = await this.axios.post(
            `${apiRoutes.purchaseorder}/linkiccid`,
            {
              PurchaseOrderItemId,
              Iccids,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      transport: async (PurchaseOrderId) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.purchaseorder}/sendiccid `,
            {
              PurchaseOrderId,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      payGetLink: async (OrderId) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.purchaseorder}/verify/payment`,
            {
              OrderId,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
    this.product = {
      getAll: async () => {
        try {
          const response = await this.axios.get(`${apiRoutes.product}/`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      add: async (product) => {
        try {
          const response = await this.axios.post(`${apiRoutes.product}/`, {
            Name: product.Name,
            Description: product.Description,
            Technology: product.Technology,
            Version: product.Version,
            Amount: product.Amount,
            SurfId: product.SurfId || null,
            PlayHubId: product.PlayHubId || null,
            CFOP: product.CFOP,
            EAN: product.EAN || "SEM GTIN",
            NCM: product.NCM,
            CEST: product.CEST,
            ICMSCst: product.ICMSCst,
            ICMSAliquot: Number(product.ICMSAliquot),
            IPICst: product.IPICst,
            IPIEnqCode: product.IPIEnqCode,
            IPIAliquot: Number(product.IPIAliquot),
            PISCst: product.PISCst,
            PISAliquot: Number(product.PISAliquot),
            COFINSCst: product.COFINSCst,
            COFINSAliquot: Number(product.COFINSAliquot),
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      update: async (product, id) => {
        console.log("Atualizar produto");
        console.log({
          Name: product.Name,
          Description: product.Description,
          Technology: product.Technology,
          Version: product.Version,
          Amount: product.Amount,
          SurfId: product.SurfId || null,
          PlayHubId: product.PlayHubId || null,
          CFOP: product.CFOP,
          EAN: product.EAN || "SEM GTIN",
          NCM: product.NCM,
          CEST: product.CEST,
          ICMSCst: product.ICMSCst,
          ICMSAliquot: Number(product.ICMSAliquot),
          IPICst: product.IPICst,
          IPIEnqCode: product.IPIEnqCode,
          IPIAliquot: Number(product.IPIAliquot),
          PISCst: product.PISCst,
          PISAliquot: Number(product.PISAliquot),
          COFINSCst: product.COFINSCst,
          COFINSAliquot: Number(product.COFINSAliquot),
        });
        try {
          const response = await this.axios.patch(
            `${apiRoutes.product}/${id}`,
            {
              Name: product.Name,
              Description: product.Description,
              Technology: product.Technology,
              Version: product.Version,
              Amount: product.Amount,
              SurfId: product.SurfId || null,
              PlayHubId: product.PlayHubId || null,
              CFOP: product.CFOP,
              EAN: product.EAN || "SEM GTIN",
              NCM: product.NCM,
              CEST: product.CEST,
              ICMSCst: product.ICMSCst,
              ICMSAliquot: Number(product.ICMSAliquot),
              IPICst: product.IPICst,
              IPIEnqCode: product.IPIEnqCode,
              IPIAliquot: Number(product.IPIAliquot),
              PISCst: product.PISCst,
              PISAliquot: Number(product.PISAliquot),
              COFINSCst: product.COFINSCst,
              COFINSAliquot: Number(product.COFINSAliquot),
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      delete: async (id) => {
        try {
          const response = await this.axios.delete(
            `${apiRoutes.product}/${id}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
    this.language = {
      set: async (language) => {
        // storage.auth.language = language;
        localStorage.setItem("language", language);
        return "ok";
      },
      get: async () => localStorage.getItem("language"),
    };

    this.preOrder = {
      add: async (
        isClient,
        DealerId,
        Name,
        Phone,
        WhatsApp,
        DocumentType,
        DocumentNumber,
        Country,
        City,
        StreetName,
        StreetNumber,
        District,
        PostalCode,
        Complement,
        State
      ) => {
        try {
          const response = await this.axios.post(`${apiRoutes.preorder}`, {
            FinalClientId: isClient ? DealerId : null,
            DealerId: !isClient ? DealerId : null,
            Name,
            Phone,
            WhatsApp,
            DocumentType,
            DocumentNumber,
            Country,
            City,
            StreetName,
            StreetNumber,
            District,
            PostalCode,
            Complement,
            State,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      get: async (page, limit, search, finalClientSearch) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.preorder}?page=${page}&limit=${limit}&search=${search}&finalClientSearch=${finalClientSearch}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };

    this.notification = {
      getAll: async (page, pageLimit, search) => {
        try {
          const res = await this.axios.get(
            `${apiRoutes.notifications}?page=${page}&limit=${pageLimit}&search=${search}`
          );
          return res;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getInfo: async (id) => {
        try {
          const res = await this.axios.get(
            `${apiRoutes.notifications}/details/${id}`
          );
          return res;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      sendNotification: async (
        Clientes,
        Vendedores,
        Representantes,
        Assunto,
        Mensagem
      ) => {
        try {
          const res = await this.axios.post(`${apiRoutes.notifications}`, {
            Clientes,
            Vendedores,
            Representantes,
            Assunto,
            Mensagem,
          });
          return res;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };

    this.user = {
      login: async (Email, Password) => {
        try {
          const response = await this.axios.post(`${apiRoutes.user}/login`, {
            Email,
            Password,
          });
          setSession(response.data.AccessToken);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      loginByCpf: async (Cpf) => {
        try {
          const res = await this.axios.get(`${apiRoutes.client}/verify/${Cpf}`);
          return res;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      blockUnblock: async (Status, Id) => {
        console.log(Id);
        try {
          const response = await this.axios.patch(`${apiRoutes.client}/${Id}`, {
            Status,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getUserSession: async (UserId) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.user}/usersection/${UserId}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      sendResetEmail: async (Email) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.user}/sendResetEmail`,
            {
              Email,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      logout: async () => {
        storage.auth.token = null;
        return "ok";
      },
      updatePassword: async (Email, Password) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.user}/updatePassword`,
            {
              Email: Email,
              Password: Password,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      updateProfile: async (Id, Profile) => {
        try {
          const response = await this.axios.patch(
            `${apiRoutes.user}/${Id}/type`,
            {
              Type: Profile,
            }
          );
          setSession(response.data.AccessToken);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      update: async (user, id) => {
        try {
          const response = await this.axios.put(`${apiRoutes.client}/${id}`, {
            ...user,
            Name: user?.name,
            Cpf: user?.cpf && cleanNumber(user.cpf),
            Rg: user?.rg,
            Cnpj: user?.cnpj && cleanNumber(user.cnpj),
            Ie: user?.ie,
            Birthday: user?.date,
            Email: user?.email,
            SecondEmail: user?.secondEmail,
            Mobile: user?.phone,
            Whatsapp: user?.whatsApp,
            PostalCode: user?.cep,
            StreetName: user?.address,
            State: user?.uf,
            City: user?.city,
            District: user?.district,
            Number: user?.number,
            Complement: user?.complement,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      updateEmail: async (Email, NewEmail) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.user}/updateEmail`,
            {
              Email: Email,
              NewEmail: NewEmail,
            }
          );
          setSession(response.data.AccessToken);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
    this.userLegacy = {
      get: async (page, limit, search) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.userlegacy}?page=${page}&limit=${limit}&search=${search}`
          );
          console.log(response);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
    this.dealer = {
      delete: async (Id) => {
        try {
          const response = await this.axios.delete(`${apiRoutes.dealer}/${Id}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getAll: async (page, limit, search) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.dealer}?page=${page}&limit=${limit}&search=${search}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      blockUnblock: async (Status, Id) => {
        try {
          const response = await this.axios.patch(`${apiRoutes.dealer}/${Id}`, {
            Status,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getAddress: async (id) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.dealer}/address/${id}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getTotals: async (date) => {
        try {
          const query = date ? `?date=${date.toISOString()}` : ''
          const response = await this.axios.get(`${apiRoutes.dealer}/totals${query}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getSome: async (page, limit, dealer) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.dealer}?page=${page}&limit=${limit}&search=${dealer}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getById: async (id) => {
        try {
          const response = await this.axios.get(`${apiRoutes.dealer}/${id}`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      new: async (company, user, bank, userLegacy, OperationCity) => {
        // return 'ok'
        try {
          const response = await this.axios.post(`${apiRoutes.dealer}`, {
            Cnpj: company.cnpj ? cleanNumber(company.cnpj) : null,
            Ie: company.ie,
            ICMSContributor: user.icmsContributor ? 1 : 0,
            Im: company.im,
            Name: user.name,
            CompanyName: company.rz,
            Cpf: user.cpf ? cleanNumber(user.cpf) : null,
            Rg: user.rg,
            Birthday: user.date,
            Email: user.email,
            SecondEmail: user.secondEmail,
            Mobile: user.phone,
            PostalCode: user.cep,
            StreetName: user.address,
            State: user.uf,
            City: user.city,
            District: user.district,
            Number: user.number,
            Complement: user.complement,
            CompanyEmail:
              company.email !== "" ? company.email : user?.companyEmail,
            CompanyMobile: company.phone,
            CompanyPostalCode: company.cep,
            CompanyStreetName: company.address,
            CompanyState: company.uf,
            CompanyCity: company.city,
            CompanyDistrict: company.district,
            CompanyNumber: company.number,
            CompanyComplement: company.complement,
            PixKeyType: bank.pixType,
            PixKey: bank.pixKey,
            Bank: bank.bankName,
            BranchNumber: bank.ag,
            BranchVerifier: bank.agDigit,
            AcountNumber: bank.account,
            AccountNumberVerifier: bank.accountDigit,
            Operation: bank.op,
            IdLegacySystem: userLegacy?.value ? userLegacy?.value : null,
            OperationCity: JSON.stringify(OperationCity),
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      update: async (id, company, user, bank, userLegacy, service) => {
        // return 'ok'
        try {
          const response = await this.axios.put(`${apiRoutes.dealer}/${id}`, {
            Cnpj: company.cnpj ? cleanNumber(company.cnpj) : null,
            Ie: company.ie,
            ICMSContributor: user.icmsContributor ? 1 : 0,
            Im: company.im,
            Name: user.name,
            CompanyName: company.rz,
            Cpf: user.cpf ? cleanNumber(user.cpf) : null,
            Rg: user.rg,
            Birthday: user.date,
            Email: user.email,
            SecondEmail: user.secondEmail,
            Mobile: user.phone,
            PostalCode: user.cep,
            StreetName: user.address,
            State: user.uf,
            City: user.city,
            District: user.district,
            Number: user.number,
            Complement: user.complement,
            CompanyEmail: company.cnpj ? company.email : user.companyEmail,
            CompanyMobile: company.phone,
            CompanyPostalCode: company.cep,
            CompanyStreetName: company.address,
            CompanyState: company.uf,
            CompanyCity: company.city,
            CompanyDistrict: company.district,
            CompanyNumber: company.number,
            CompanyComplement: company.complement,
            PixKeyType: bank.pixType,
            PixKey: bank.pixKey,
            Bank: bank.bankName,
            BranchNumber: bank.ag,
            BranchVerifier: bank.agDigit,
            AcountNumber: bank.account,
            AccountNumberVerifier: bank.accountDigit,
            Operation: bank.op,
            IdLegacySystem: userLegacy?.value ? userLegacy?.value : null,
            OperationCity: service && JSON.stringify(service),
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
    this.line = {
      myLines: async (pageNum, pageSize) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/myLines?limit=${pageSize}&page=${pageNum}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      syncMyLines: async (doc, FinalClientId, DealerId) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/surf/syncmylines`,
            {
              doc,
              FinalClientId,
              DealerId,
            }
          );
          console.log(response);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getLines: async (pageNum, pageSize, dealer, line, status, searchType) => {
        const findLine = searchType ? `&${searchType}=${line}` : "";
        const findStatus = status ? `&Status=${status}` : "";
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/getLines?limit=${pageSize}&page=${pageNum}&Dealer=${dealer}${findLine}${findStatus}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getLinesRoot: async (pageNum, pageSize, search, dealer) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/tegg/getLines?limit=${pageSize}&page=${pageNum}&search=${search}&dealer=${dealer}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getClientLines: async (pageNum, pageSize, finalClient) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/getLines/${finalClient}?limit=${pageSize}&page=${pageNum}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      portIn: async (msisdn, msisdnOutraOperadora, operadora, doc, nome) => {
        try {
          const response = await this.axios.post(`${apiRoutes.iccid}/portin`, {
            msisdn: Number(`${msisdn}`),
            msisdnOutraOperadora: Number(`55${msisdnOutraOperadora}`),
            operadora: operadora,
            doc: doc,
            nome: nome,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      updatePortIn: async (
        msisdn,
        msisdnOutraOperadora,
        operadora,
        doc,
        nome
      ) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/portin/update`,
            {
              msisdn: msisdn,
              msisdnOutraOperadora: msisdnOutraOperadora,
              operadora: operadora,
              doc: doc,
              nome: nome,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      cancelPortIn: async (Id) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/portin/cancel`,
            {
              Id,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      disconnectPortIn: async (msisdnOutraOperadora) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/portin/disconnect`,
            {
              msisdnOutraOperadora: msisdnOutraOperadora,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      checkPortIn: async (msisdn, msisdnOutraOperadora) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/portin/check`,
            {
              msisdn: msisdn,
              msisdnOutraOperadora: msisdnOutraOperadora,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      portOut: async (msisdn, autorizar) => {
        try {
          const response = await this.axios.post(`${apiRoutes.iccid}/portout`, {
            msisdn: msisdn,
            autorizar: autorizar,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      createPortRequest: async (
        dealerId,
        finalClientId,
        status,
        window,
        type,
        oldLine,
        newLine,
        oldProvider,
        UserDoc
      ) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/portRequest`,
            {
              DealerId: dealerId,
              FinalClientId: finalClientId,
              Status: status,
              Window: window,
              Type: type,
              OldLine: oldLine,
              NewLine: newLine,
              OldProvider: oldProvider,
              UserDoc,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getPortRequests: async (pageNum, pageSize, search) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/portRequest?page=${pageNum}&limit=${pageSize}&search=${search}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getPortRequestById: async (id) => {
        try {
          const response = await this.axios.get(
            `${apiRoutes.iccid}/portRequest/${id}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      updatePortRequest: async (id, status) => {
        try {
          const response = await this.axios.put(
            `${apiRoutes.iccid}/portRequest/${id}`,
            {
              Status: status,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      deletePortRequest: async (id) => {
        try {
          const response = await this.axios.delete(
            `${apiRoutes.iccid}/portRequest/${id}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      updateExpireWarningDay: async (iccid, day) => {
        console.log(`${apiRoutes.iccid}/expire/${iccid}`, {
          Day: day,
        });
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/expire/${iccid}`,
            {
              Day: day,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getDataConsumption: async (msisdn, year, month) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/consumption/data/${msisdn}`,
            {
              Year: year,
              Month: month,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getSmsConsumption: async (msisdn, year, month) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/consumption/sms/${msisdn}`,
            {
              Year: year,
              Month: month,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getCallConsumption: async (msisdn, year, month) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.iccid}/consumption/call/${msisdn}`,
            {
              Year: year,
              Month: month,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
    this.nfe = {
      getNFeInfo: async () => {
        try {
          const response = await this.axios.get(`${apiRoutes.nfe}Info/1`);
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      updateNFeCompanyInfo: async (
        Name,
        Cnpj,
        Ie,
        Im,
        Cnae,
        Crt,
        Cep,
        Address,
        AddressNumber,
        District,
        City,
        CityCode,
        UF,
        UFCode,
        PartnerKey,
        CommunicationKey,
        NFeGroup,
        NFeNumber
      ) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.nfe}Info/company/1`,
            {
              Name: Name || null,
              CNPJ: Cnpj || null,
              IE: Ie || null,
              IM: Im || null,
              CNAE: Cnae || null,
              CRT: Crt || null,
              CEP: Cep || null,
              Address: Address || null,
              AddressNumber: AddressNumber || null,
              District: District || null,
              City: City || null,
              CityCode: CityCode || null,
              UF: UF || null,
              UFCode: UFCode || null,
              PartnerKeyMigrate: PartnerKey || null,
              CommunicationKeyMigrate: CommunicationKey || null,
              NFeGroup,
              NFeNumber,
            }
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      updateNFeInfo: async (Group, Number) => {
        try {
          const response = await this.axios.post(`${apiRoutes.nfe}Info/nfe/1`, {
            NFeGroup: Group,
            NFeNumber: Number,
          });
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      getAll: async (pageNum, pageSize, statusCode) => {
        const query = statusCode ? `&statusCode=${statusCode}` : "";
        try {
          console.log(
            `${apiRoutes.nfe}?limit=${pageSize}&page=${pageNum}${query}`
          );
          const response = await this.axios.get(
            `${apiRoutes.nfe}?limit=${pageSize}&page=${pageNum}${query}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
      resend: async (id) => {
        try {
          const response = await this.axios.post(
            `${apiRoutes.nfe}/resend/${id}`
          );
          return response;
        } catch (e) {
          throwFormattedError(e);
        }
      },
    };
  }
}

const api = new Api();
export default api;
