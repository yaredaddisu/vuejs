import { createStore } from "vuex";
import axiosClient from "../axios";

const store = createStore({
  state: {
    products: [],
    product: null,
    cart: [],

    user: {
      token: sessionStorage.getItem("TOKEN"),
      data: {},
    },

    questionTypes: ["text", "select", "checkbox", "textarea"],
    members: {
      loading: false,
      data: [],
      links: [],
      from: null,
      to: null,
      page: 1,
      limit: null,
      total: null,
    },
    userReports: {
      loading: false,
      data: [],
      links: [],
      from: null,
      to: null,
      page: 1,
      limit: null,
      total: null,
    },
    userPurchaseReports: {
      loading: false,
      data: [],
      links: [],
      from: null,
      to: null,
      page: 1,
      limit: null,
      total: null,
    },
    userBuyReports: {
      loading: false,
      data: [],
      links: [],
      from: null,
      to: null,
      page: 1,
      limit: null,
      total: null,
    },
    currentMember: {
      data: {},
      loading: false,
    },
    users: {
      data: [],
      loading: false,
      links: [],
      from: null,
      to: null,
      page: 1,
      limit: null,
      total: null,
    },

    surveys: {
      loading: false,
      links: [],
      data: [],
    },
    currentSurvey: {
      data: {},
      loading: false,
    },
    currentReport: {
      data: {},
      loading: false,
    },
    currentPurchase: {
      data: {},
      loading: false,
    },
    dashboard: {
      loading: false,
      data: {},
    },

    currentProductList: {
      loading: false,
      data: {},
    },

    currentProduct: {
      loading: false,
      data: {},
    },
    currentAllProduct: {
      loading: false,
      data: {},
    },

    Allproducts: {
      data: [],
      loading: false,
      links: [],
      from: null,
      to: null,
      page: 1,
      limit: null,
      total: null,
    },
    AllProductList: {
      data: [],
      loading: false,
      links: [],
      from: null,
      to: null,
      page: 1,
      limit: null,
      total: null,
    },

    products: {
      data: [],
      loading: false,
      links: [],
      from: null,
      to: null,
      page: 1,
      limit: null,
      total: null,
    },

    currentUser: {
      loading: false,
      data: {},
    },
    currentDetail: {
      loading: false,
      data: {},
    },
    currentPurchase: {
      loading: false,
      data: {},
    },
    currentCategory: {
      loading: false,
      data: {},
    },
    currentHouse: {
      loading: false,
      data: {},
    },
    currentPrice: {
      loading: false,
      data: {},
      links: [],
      from: null,
      to: null,
      page: 1,
      limit: null,
      total: null,
    },
    logos: {
      loading: false,
      data: [],
    },
    category: {
      loading: false,
      data: [],
    },
    house: {
      loading: false,
      data: [],
    },
    purchase: {
      loading: false,
      data: [],
      links: [],
      from: null,
      to: null,
      page: 1,
      limit: null,
      total: null,
    },
    productList: {
      loading: false,
      data: [],
    },

    details: {
      loading: false,
      data: [],
      links: [],
      from: null,
      to: null,
      page: 1,
      limit: null,
      total: null,
    },
    error: {
      show: false,
      type: "error",
      message: "",
    },
    notification: {
      show: false,
      type: "success",
      message: "",
    },
  },
  getters: {
    cartItemCount: (state) => {
      return state.cart.length;
    },

    Shipping: (state) => {
      let total = 0;
      state.cart.forEach((item) => {
        total = item.shipping;

        //console.log(item.amount) ;
      });
      return total;
    },

    Tax: (state) => {
      let total = 0;
      state.cart.forEach((item) => {
        let tax = item.tax / 100;

        total = item.amount * tax;

        // console.log(item) ;
      });
      return total;
    },

    cartTotalPrice: (state) => {
      let total = 0;

      state.cart.forEach((item) => {
        let totalQuantity = [];
        let totalSalesPrice = [];

        //total += data.salesPrice * data.quantity * -1;

        let s = item.questions.map((items2, _) => {
          return parseInt(items2.salesPrice);
        });
        let d = item.questions.map((items2, _) => {
          return parseInt(items2.quantity);
        });

        let sum = s.reduce((a, b) => a + b, 0);
        totalSalesPrice.push({
          sum,
        });

        let sumQ = d.reduce((a, b) => a + b, 0);
        totalQuantity.push({
          sumQ,
        });

        total = sum * sumQ * -1;

        // console.log(total)
      });
      return total;
    },

    totalQuantity: (state) => {
      let total = 0;

      state.cart.forEach((item) => {
        let quantity = [];

        let s = item.questions.map((items2, _) => {
          return parseInt(items2.quantity);
        });

        let sum = s.reduce((a, b) => a + b, 0);
        quantity.push({
          sum,
        });

        total = sum * -1;
      });
      return total;
    },

    ///
  },
  actions: {
    // members start
    addMember({ commit, dispatch }, member, errors) {
      let response;
      if (member.id) {
        response = axiosClient
          .put(`/members/${member.id}`, member)
          .then((res) => {
            commit("setCurrentMember", res.data);
            return res;
          });
      } else {
        response = axiosClient.post("/members", member).then((res) => {
          commit("setCurrentMember", res.data);
          return res;
        });
      }

      return response;
    },

    showMember({ commit }, { id: id }) {
      commit("setCurrentMemberLoading", true);

      return axiosClient
        .get(`/members/${id}`)
        .then((res) => {
          commit("setCurrentMember", res.data);
          commit("setCurrentMemberLoading", false);
        })
        .catch((error) => {
          commit("setCurrentMemberLoading", false);

          console.log(error);
        });
    },

    getMembers(
      { commit, state },
      {
        url = null,
        search = "",
        per_page,
        sort_field,
        sort_direction,
        filed,
        direction,
      } = {}
    ) {
      commit("setMembers", [true]);
      url = url || "/members";
      const params = {
        per_page: state.members.limit,
      };
      return axiosClient
        .get(url, {
          params: {
            ...params,
            search,
            per_page,
            sort_field,
            sort_direction,
            filed,
            direction,
          },
        })
        .then((response) => {
          commit("setMembers", [false, response.data]);
        })
        .catch(() => {
          commit("setMembers", [false]);
        });
    },

    getUserReports(
      { commit, state },
      {
        url = null,
        id,
        keyword,
        warehouse,
        search = "",
        per_page,
        sort_field,
        sort_direction,
        filed,
        direction,
      } = {}
    ) {
      commit("setUserReports", [true]);
      url = url || "/user-reports";
      const params = {
        per_page: state.userReports.limit,
      };
      return axiosClient
        .get(url, {
          params: {
            ...params,
            id,
            keyword,
            warehouse,
            search,
            per_page,
            sort_field,
            sort_direction,
            filed,
            direction,
          },
        })
        .then((response) => {
          commit("setUserReports", [false, response.data]);
        })
        .catch(() => {
          commit("setUserReports", [false]);
        });
    },
    getUserPurchaseReports(
      { commit, state },
      {
        url = null,
        id,
        warehouse,
        search = "",
        per_page,
        sort_field,
        sort_direction,
        filed,
        direction,
      } = {}
    ) {
      commit("setUserPurchaseReports", [true]);
      url = url || "/user-purchase-reports";
      const params = {
        per_page: state.userReports.limit,
      };
      return axiosClient
        .get(url, {
          params: {
            ...params,
            id,
            warehouse,
            search,
            per_page,
            sort_field,
            sort_direction,
            filed,
            direction,
          },
        })
        .then((response) => {
          commit("setUserPurchaseReports", [false, response.data]);
        })
        .catch(() => {
          commit("setUserPurchaseReports", [false]);
        });
    },
    getUserBuyReports(
      { commit, state },
      {
        url = null,
        id,
        keyword,
        warehouse,
        search = "",
        per_page,
        sort_field,
        sort_direction,
        filed,
        direction,
      } = {}
    ) {
      commit("setUserBuyReports", [true]);
      url = url || "/user-buy-reports";
      const params = {
        per_page: state.userReports.limit,
      };
      return axiosClient
        .get(url, {
          params: {
            ...params,
            id,
            keyword,
            warehouse,
            search,
            per_page,
            sort_field,
            sort_direction,
            filed,
            direction,
          },
        })
        .then((response) => {
          commit("setUserBuyReports", [false, response.data]);
        })
        .catch(() => {
          commit("setUserBuyReports", [false]);
        });
    },
    clearCartItems({}, cart) {
      return axiosClient
        .post("/delete-cart", { data: cart })
        .then((response) => {});
    },
    addProductToCart(
      { commit },
      {
        tax,
        shipping,
        amount,
        questions,
        TotalProduct,
        TotalQuantity,
        Reference,
        name,
        email,
        phone,
        address,
        paymentMethod,
        PayedAmount,
        Tin,
        Vat,
        Note,
        GrandTotal,
        Due,
      }
    ) {
      // commit("setCurrentDetailLoading", true);

      return axiosClient
        .post("/details", {
          tax,
          shipping,
          amount,
          questions,
          TotalQuantity,
          TotalProduct,
          Reference,
          name,
          email,
          phone,
          address,
          paymentMethod,
          PayedAmount,
          Tin,
          Vat,
          Note,
          GrandTotal,
          Due,
        })
        .then((res) => {
          commit("setCurrentDetail", res.data);
          return res;
        });
    },
    addPurchseToCart(
      { commit },
      {
        supplier_id,
        dateOfPurchase,
        dateOfDelivery,
        status,
        note,
        purchases: cart,
      }
    ) {
      // commit("setCurrentDetailLoading", true);

      return axiosClient
        .post("/purchase", {
          supplier_id,
          dateOfPurchase,
          dateOfDelivery,
          status,
          note,
          purchases: cart,
        })
        .then((res) => {
          commit("setCurrentPurchase", res.data);
          return res;
        });
    },
    updatePurchseToCart(
      { commit },
      {
        supplier_id,
        id,
        status,
        dateOfPurchase,
        dateOfDelivery,
        note,
        purchases: cart,
      }
    ) {
      // commit("setCurrentDetailLoading", true);

      return axiosClient

        .put(`/purchase/${id}`, {
          id,
          supplier_id,
          status,
          dateOfPurchase,
          dateOfDelivery,
          note,
          purchases: cart,
        })
        .then((res) => {
          commit("setCurrentPurchase", res.data);
          return res;
        });
    },
    getCartItems({ commit }) {
      return axiosClient
        .get("/temp-print")
        .then((res) => {
          commit("SET_CART", res.data.data);

          return res;
        })
        .catch((err) => {
          throw err;
        });
    },

    getDetails(
      { commit, state },
      {
        url = null,
        search = "",
        keyword = " ",
        per_page,
        sort_field,
        sort_direction,
        filed,
        direction,
      } = {}
    ) {
      commit("SET_DETAIL", [true]);
      commit("SET_DETAIL_Loading", true);
      url = url || "details";
      const params = {
        per_page: state.details.limit,
      };
      return axiosClient
        .get(url, {
          params: {
            ...params,
            search,
            keyword,
            per_page,
            sort_field,
            sort_direction,
            filed,
            direction,
          },
        })
        .then((response) => {
          commit("SET_DETAIL", [false, response.data]);
        })
        .catch(() => {
          commit("SET_DETAIL", [false]);
        });
    },

    getDetail({ commit }, id) {
      commit("setCurrentDetailLoading", true);
      return axiosClient
        .get(`/details/${id}`)
        .then((res) => {
          commit("setCurrentDetail", res.data);
          commit("setCurrentDetailLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentDetailLoading", false);
          throw err;
        });
    },
    getUserReport({ commit }, id) {
      commit("setCurrentReportsLoading", true);
      return axiosClient
        .get(`/user-reports/${3}`)
        .then((res) => {
          commit("setCurrentReports", res.data);
          commit("setCurrentReportsLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentReportsLoading", false);
          throw err;
        });
    },

    saveCategoryOnce({ commit, dispatch }, survey) {
      let response;

      response = axiosClient.post("/category-Once", survey).then((res) => {
        commit("setCurrentCategory", res.data);
        return res;
      });

      return response;
    },
    createUser({ commit }, user) {
      delete user.image_url;

      let response;
      if (user.id) {
        response = axiosClient
          .put(`/user-managment/${user.id}`, user)
          .then((res) => {
            commit("setCurrentUser", res.data);
            return res;
          });
      } else {
        response = axiosClient.post("/user-managment", user).then((res) => {
          commit("setCurrentUser", res.data);
          return res;
        });
      }

      return response;
    },
    getPurchaseBySlug({ commit }, slug) {
      commit("setCurrentPurchaseLoading", true);
      return axiosClient
        .get(`/purchase/${slug}`)
        .then((res) => {
          commit("setCurrentPurchase", res.data);
          commit("setCurrentPurchaseLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentPurchaseLoading", false);
          throw err;
        });
    },
    getSurvey({ commit }, id) {
      commit("setCurrentSurveyLoading", true);
      return axiosClient
        .get(`/survey/${id}`)
        .then((res) => {
          commit("setCurrentSurvey", res.data);
          commit("setCurrentSurveyLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentSurveyLoading", false);
          throw err;
        });
    },

    saveSurvey({ commit, dispatch }, survey) {
      delete survey.image_url;

      let response;
      if (survey.id) {
        response = axiosClient
          .put(`/survey/${survey.id}`, survey)
          .then((res) => {
            commit("setCurrentSurvey", res.data);
            return res;
          });
      } else {
        response = axiosClient.post("/survey", survey).then((res) => {
          commit("setCurrentSurvey", res.data);
          return res;
        });
      }

      return response;
    },
    saveProductOnce({ commit, dispatch }, survey) {
      let response;

      response = axiosClient.post("/product-Once", survey).then((res) => {
        commit("setCurrentSurvey", res.data);
        return res;
      });

      return response;
    },

    getDashboardData({ commit }) {
      commit("dashboardLoading", true);
      return axiosClient
        .get(`/dashboard`)
        .then((res) => {
          commit("dashboardLoading", false);
          commit("setDashboardData", res.data);
          return res;
        })
        .catch((error) => {
          commit("dashboardLoading", false);
          return error;
        });
    },

    getAllProductList(
      { commit, state },
      {
        url = null,
        search = "",
        per_page,
        sort_field,
        sort_direction,
        filed,
        direction,
      } = {}
    ) {
      commit("setProductList", [true]);
      commit("setProductListLoading", true);
      url = url || "survey";
      const params = {
        per_page: state.AllProductList.limit,
      };
      return axiosClient
        .get(url, {
          params: {
            ...params,
            search,
            per_page,
            sort_field,
            sort_direction,
            filed,
            direction,
          },
        })
        .then((response) => {
          commit("setProductList", [false, response.data]);
        })
        .catch(() => {
          commit("setProductList", [false]);
        });
    },

    getProductsList({ commit }, id) {
      commit("setCurrentProductsListLoading", true);
      return axiosClient
        .get(`/product-list/${id}`)
        .then((res) => {
          commit("setCurrentProductsList", res.data);
          commit("setCurrentProductsListLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentProductsListLoading", false);
          throw err;
        });
    },

    getAllProduct({ commit }, id) {
      commit("setCurrentAllProductLoading", true);
      return axiosClient
        .get(`/all-product/${id}`)
        .then((res) => {
          commit("setCurrentAllProduct", res.data);
          commit("setCurrentAllProductLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentAllProductLoading", false);
          throw err;
        });
    },

    saveAllProduct({ commit }, AllProducts) {
      let response;
      if (AllProducts.id) {
        response = axiosClient
          .put(`/all-product/${id}`, AllProducts)
          .then((res) => {
            commit("setCurrentAllProduct", res.data);
            return res;
          });
      } else {
        response = axiosClient.post("/all-product", AllProducts).then((res) => {
          commit("setCurrentAllProduct", res.data);
          return res;
        });
      }

      return response;
    },

    saveProduct({ commit, dispatch }, product) {
      delete product.image_url;

      let response;
      if (product.id) {
        response = axiosClient
          .put(`/product/${product.id}`, product)
          .then((res) => {
            commit("setCurrentProduct", res.data);
            return res;
          });
      } else {
        response = axiosClient.post("/product", product).then((res) => {
          commit("setCurrentProduct", res.data);
          return res;
        });
      }

      return response;
    },

    getCurrentUser({ commit }, data) {
      return axiosClient.get("/user", data).then(({ data }) => {
        commit("setUser", data);
        return data;
      });
    },
    updateProfile({ commit }, userData) {
      delete userData.image_url;
      let response;
      const token = store.state.user.token; // get the token from state
      response = axiosClient
        .put("/update-data", {
          name: userData.name,
          email: userData.email,
          image: userData.image,
          phone: userData.phone,
          company: userData.company,
          address: userData.address,
          secret: userData.secret,
          UserSecret: userData.UserSecret,
          Tin: userData.Tin,
          Vat: userData.Vat,
        })
        .then((res) => {
          if (res) {
            store.commit("notify", {
              type: "success",
              message: res.data.success,
            });
          }
          store.dispatch("getUser");

          commit("setUser", res.data);

          return res;
        });
      store.dispatch("getUser");

      return response;
    },

    register({ commit }, user) {
      return axiosClient.post("/register", user).then(({ data }) => {
        commit("setUser", data.user);
        commit("setToken", data.token);
        return data;
      });
    },
    login({ commit }, user) {
      return axiosClient.post("/login", user).then(({ data }) => {
        commit("setUser", data.user);
        commit("setToken", data.token);
        return data;
      });
    },
    logout({ commit }) {
      return axiosClient.post("/logout").then((response) => {
        commit("logout");
        return response;
      });
    },

    saveCategory({ commit }, category) {
      let response;
      if (category.id) {
        response = axiosClient
          .put(`/category/${category.id}`, category)
          .then((res) => {
            commit("setCurrentCategory", res.data);
            return res;
          });
      } else {
        response = axiosClient.post("/category", category).then((res) => {
          commit("setCurrentCategory", res.data);
          return res;
        });
      }

      return response;
    },

    saveWarehouse({ commit, dispatch }, house, errors) {
      let response;
      if (house.id) {
        response = axiosClient
          .put(`/warehouses/${house.id}`, house)
          .then((res) => {
            commit("setCurrentHouse", res.data);
            return res;
          });
      } else {
        response = axiosClient.post("/warehouses", house).then((res) => {
          commit("setCurrentHouse", res.data);
          return res;
        });
      }

      return response;
    },
    saveProductList({ commit }, productList) {
      delete productList.image_url;

      let response;
      if (productList.id) {
        response = axiosClient
          .put(`/product-list/${productList.id}`, productList)
          .then((res) => {
            commit("setCurrentProductList", res.data);
            return res;
          });
      } else {
        response = axiosClient
          .post("/product-list", productList)
          .then((res) => {
            commit("setCurrentProductList", res.data);
            return res;
          });
      }

      return response;
    },

    saveLogo({ commit, dispatch }, logo) {
      delete logo.image_url;

      let response;
      if (logo.id) {
        response = axiosClient.put(`/logo/${logo.id}`, logo).then((res) => {
          commit("setCurrentLogo", res.data);
          return res;
        });
      } else {
        response = axiosClient.post("/logo", logo).then((res) => {
          commit("setCurrentLogo", res.data);
          return res;
        });
      }

      return response;
    },

    getLogo({ commit }, id) {
      commit("setCurrentLogoLoading", true);
      return axiosClient
        .get(`/logo/${id}`)
        .then((res) => {
          commit("setCurrentLogo", res.data);
          commit("setCurrentLogoLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentLogoLoading", false);
          throw err;
        });
    },

    getUserManagment({ commit }, id) {
      commit("setCurrentUserLoading", true);
      return axiosClient
        .get(`/user-managment/${id}`)
        .then((res) => {
          commit("setCurrentUser", res.data);
          commit("setCurrentUserLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentUserLoading", false);
          throw err;
        });
    },

    getProductList({ commit }, id) {
      commit("setCurrentProductListLoading", true);
      return axiosClient
        .get(`/product-list/${id}`)
        .then((res) => {
          commit("setCurrentProductList", res.data);
          commit("setCurrentProductListLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentProductListLoading", false);
          throw err;
        });
    },
    getCategory({ commit }, id) {
      commit("setCurrentCategoryLoading", true);
      return axiosClient
        .get(`/category/${id}`)
        .then((res) => {
          commit("setCurrentCategory", res.data);
          commit("setCurrentCategoryLoading", false);
          return res;
        })
        .catch((err) => {
          commit("setCurrentCategoryLoading", false);
          throw err;
        });
    },
    getWarehouse({ commit }, { id: id }) {
      commit("setCurrentHouseLoading", true);
      return axiosClient
        .get(`/warehouses/${id}`)
        .then((res) => {
          commit("setCurrentHouse", res.data);
          commit("setCurrentHouseLoading", false);
        })
        .catch((error) => {
          commit("setCurrentMemberLoading", false);

          console.log(error);
        });
    },

    getWarehouses(
      { commit, state },
      {
        url = null,
        search = "",
        per_page,
        sort_field,
        sort_direction,
        filed,
        direction,
      } = {}
    ) {
      commit("setWarehouse", [true]);
      url = url || "/warehouses";
      const params = {
        per_page: state.members.limit,
      };
      return axiosClient
        .get(url, {
          params: {
            ...params,
            search,
            per_page,
            sort_field,
            sort_direction,
            filed,
            direction,
          },
        })
        .then((response) => {
          commit("setWarehouse", [false, response.data]);
        })
        .catch(() => {
          commit("setWarehouse", [false]);
        });
    },

    getCategories({ commit }, { url = null } = {}) {
      commit("setCategoryLoading", true);
      url = url || "/category";
      return axiosClient.get(url).then((res) => {
        commit("setCategoryLoading", false);
        commit("setCategory", res.data);
        return res;
      });
    },

    getPurchases(
      { commit, state },
      {
        url = null,
        search = "",
        per_page,
        sort_field,
        sort_direction,
        filed,
        direction,
      } = {}
    ) {
      commit("setPurchaseLoading", [true]);
      url = url || "/purchase";
      const params = {
        per_page: state.users.limit,
      };
      return axiosClient
        .get(url, {
          params: {
            ...params,
            search,
            per_page,
            sort_field,
            sort_direction,
            filed,
            direction,
          },
        })
        .then((response) => {
          commit("setPurchase", [false, response.data]);
        })
        .catch(() => {
          commit("setPurchase", [false]);
        });
    },

    getLogos({ commit }, { url = null } = {}) {
      commit("setLogosLoading", true);
      url = url || "/logo";
      return axiosClient.get(url).then((res) => {
        commit("setLogosLoading", false);
        commit("setLogos", res.data);
        return res;
      });
    },

    getUsers(
      { commit, state },
      {
        url = null,
        search = "",
        per_page,
        sort_field,
        sort_direction,
        filed,
        direction,
      } = {}
    ) {
      commit("setUsers", [true]);
      url = url || "/user-managment";
      const params = {
        per_page: state.users.limit,
      };
      return axiosClient
        .get(url, {
          params: {
            ...params,
            search,
            per_page,
            sort_field,
            sort_direction,
            filed,
            direction,
          },
        })
        .then((response) => {
          commit("setUsers", [false, response.data]);
        })
        .catch(() => {
          commit("setUsers", [false]);
        });
    },

    deleteProductList({ dispatch }, id) {
      return axiosClient.delete(`/survey/${id}`).then((res) => {
        dispatch("getAllProductList");
        return res;
      });
    },
    deleteCategory({}, id) {
      return axiosClient.delete(`/category/${id}`);
    },
    deleteSinglePurchase({}, id) {
      return axiosClient.delete(`/purchase/${id}`);
    },
    deleteUser({}, id) {
      return axiosClient.delete(`/users/${id}`);
    },

    deleteLogo({}, id) {
      return axiosClient.delete(`/logo/${id}`);
    },

    deleteAllMember({}, checked) {
      return axiosClient
        .post("/member/delete-all-member", { data: checked })
        .then((response) => {});
    },
    deleteAlldetail({}, checked) {
      return axiosClient
        .post("/details/delete-all-detail", { data: checked })
        .then((response) => {});
    },
    deleteAllProductList({}, checked) {
      return axiosClient
        .post("/product/delete-all-product", { data: checked })
        .then((response) => {});
    },
    deletePurchase({}, checked) {
      return axiosClient
        .post("/delete-all-purchase", { data: checked })
        .then((response) => {});
    },
    deleteUserPayment({}, checked) {
      return axiosClient
        .post("/user/delete-user-payment", { data: checked })
        .then((response) => {});
    },

    deleteLogoAll({}, checked) {
      return axiosClient
        .post("/logo/deleteall/", { data: checked })
        .then((response) => {});
    },
    deleteLogo({}, id) {
      return axiosClient.delete(`/logo/${id}`);
    },

    deleteAllUser({}, checked) {
      return axiosClient.post(`/users/deleteAllUser`, { data: checked });
    },
    getUser({ commit }) {
      return axiosClient.get("/user").then((res) => {
        //console.log(res);
        commit("setUser", res.data);
      });
    },

    deleteLogo({}, id) {
      return axiosClient.delete(`/logo/${id}`);
    },
    deleteHouse({ dispatch }, id) {
      return axiosClient.delete(`/warehouses/${id}`).then((res) => {
        dispatch("getWarehouses");
        return res;
      });
    },
    deleteMember({ dispatch }, id) {
      return axiosClient.delete(`/members/${id}`).then((res) => {
        dispatch("getMembers");
        return res;
      });
    },
    deleteAllMember({}, checked) {
      return axiosClient
        .post("/member/delete-all-member", { data: checked })
        .then((response) => {
          return response;
        });
    },
  },
  mutations: {
    setSurveysLoading: (state, loading) => {
      state.surveys.loading = loading;
    },
    setSurveys: (state, surveys) => {
      state.surveys.links = surveys.meta.links;
      state.surveys.data = surveys.data;
    },
    setCurrentSurveyLoading: (state, loading) => {
      state.currentSurvey.loading = loading;
    },
    setCurrentSurvey: (state, survey) => {
      state.currentSurvey.data = survey.data;
    },

    setCurrentDetailLoading: (state, loading) => {
      state.currentDetail.loading = loading;
    },
    setCurrentDetail: (state, detail) => {
      state.currentDetail.data = detail.data;
    },
    setCurrentReportsLoading: (state, loading) => {
      state.currentReport.loading = loading;
    },
    setCurrentReports: (state, report) => {
      state.currentReport.data = report.data;
    },

    setCurrentPurchaseLoading: (state, loading) => {
      state.CurrentPurchase.loading = loading;
    },
    setCurrentPurchase: (state, detail) => {
      state.CurrentPurchase.data = detail.data;
    },
    setProductListLoading: (state, loading) => {
      state.AllProductList.loading = loading;
    },
    setProductList(state, [loading, data = null]) {
      if (data) {
        state.AllProductList = {
          ...state.AllProductList,
          data: data.data,
          links: data.meta?.links,
          page: data.meta.current_page,
          limit: data.meta.per_page,
          from: data.meta.from,
          to: data.meta.to,
          total: data.meta.total,
        };
      }
      state.AllProductList.loading = loading;
    },

    ///

    dashboardLoading: (state, loading) => {
      state.dashboard.loading = loading;
    },
    setDashboardData: (state, data) => {
      state.dashboard.data = data;
    },

    setCurrentProductsListLoading: (state, loading) => {
      state.currentProductList.loading = loading;
    },
    setCurrentProductsList: (state, productList) => {
      state.currentProductList.data = productList.data;
    },

    //
    setCurrentAllProduct: (state, product) => {
      state.currentAllProduct.data = product.data;
    },

    setCurrentAllProductLoading: (state, loading) => {
      state.currentAllProduct.loading = loading;
    },

    setCurrentLogoLoading: (state, loading) => {
      state.logos.loading = loading;
    },
    setCurrentLogo: (state, logos) => {
      state.logos.data = logos.data;
    },

    /////

    setCategoryLoading: (state, loading) => {
      state.category.loading = loading;
    },
    setCategory: (state, category) => {
      state.category.data = category.data;
    },
    setPurchaseLoading: (state, loading) => {
      state.purchase.loading = loading;
    },

    setPurchase(state, [loading, data = null]) {
      if (data) {
        state.purchase = {
          ...state.purchase,
          data: data.data,
          links: data.meta?.links,
          page: data.meta.current_page,
          limit: data.meta.per_page,
          from: data.meta.from,
          to: data.meta.to,
          total: data.meta.total,
        };
      }
      state.purchase.loading = loading;
    },
    setWarehouse(state, [loading, data = null]) {
      if (data) {
        state.house = {
          ...state.house,
          data: data.data,
          links: data.meta?.links,
          page: data.meta.current_page,
          limit: data.meta.per_page,
          from: data.meta.from,
          to: data.meta.to,
          total: data.meta.total,
        };
      }
      state.house.loading = loading;
    },

    setLogosLoading: (state, loading) => {
      state.logos.loading = loading;
    },
    setLogos: (state, logos) => {
      state.logos.data = logos.data;
    },

    ///
    setCurrentUserLoading: (state, loading) => {
      state.currentUser.loading = loading;
    },
    setCurrentUser: (state, currentUser) => {
      state.currentUser.data = currentUser.data;
    },
    setCurrentPrice: (state, currentPrice) => {
      state.currentPrice.data = currentPrice.data;
    },

    setUsersLoading: (state, loading) => {
      state.currentUser.loading = loading;
    },
    setUsers: (state, currentUser) => {
      state.currentUser.data = currentUser.data;
    },

    SET_DETAIL_Loading: (state, loading) => {
      state.details.loading = loading;
    },
    SET_DETAIL(state, [loading, data = null]) {
      if (data) {
        state.details = {
          ...state.details,
          data: data.data,
          links: data.meta?.links,
          page: data.meta.current_page,
          limit: data.meta.per_page,
          from: data.meta.from,
          to: data.meta.to,
          total: data.meta.total,
        };
      }
      state.details.loading = loading;
    },

    setUsers(state, [loading, data = null]) {
      if (data) {
        state.users = {
          ...state.users,
          data: data.data,
          links: data.meta?.links,
          page: data.meta.current_page,
          limit: data.meta.per_page,
          from: data.meta.from,
          to: data.meta.to,
          total: data.meta.total,
        };
      }
      state.users.loading = loading;
    },

    setCurrentProductList: (state, productList) => {
      state.currentProductList.data = productList.data;
    },
    setCurrentProductListLoading: (state, loading) => {
      state.currentProductList.loading = loading;
    },

    //
    setCurrentCategory: (state, category) => {
      state.currentCategory.data = category.data;
    },
    setCurrentCategoryLoading: (state, loading) => {
      state.currentCategory.loading = loading;
    },
    setCurrentHouse: (state, house) => {
      state.currentHouse.data = house.data;
    },
    setCurrentHouseLoading: (state, loading) => {
      state.currentHouse.loading = loading;
    },

    setCurrentPurchaseLoading: (state, loading) => {
      state.currentPurchase.loading = loading;
    },
    setCurrentPurchase: (state, purchase) => {
      state.currentPurchase.data = purchase.data;
    },
    setUser(state, user) {
      state.user.data = user;
    },
    setToken: (state, token) => {
      state.user.token = token;
      sessionStorage.setItem("TOKEN", token);
    },
    logout: (state) => {
      state.user.token = null;
      state.user.data = {};
      sessionStorage.removeItem("TOKEN");
    },

    SET_CART: (state, cartItems) => {
      state.cart = cartItems;
    },
    setCurrentMemberLoading: (state, loading) => {
      state.currentMember.loading = loading;
    },
    setCurrentMember: (state, member) => {
      state.currentMember.data = member.data;
    },
    setMembersLoading: (state, loading) => {
      state.members.loading = loading;
    },
    setMembers(state, [loading, data = null]) {
      if (data) {
        state.members = {
          ...state.members,
          data: data.data,
          links: data.meta?.links,
          page: data.meta.current_page,
          limit: data.meta.per_page,
          from: data.meta.from,
          to: data.meta.to,
          total: data.meta.total,
        };
      }
      state.members.loading = loading;
    },
    setUserReportLoading: (state, loading) => {
      state.userReports.loading = loading;
    },

    setUserReports(state, [loading, data = null]) {
      if (data) {
        state.userReports = {
          ...state.userReports,
          data: data.data,
          links: data.meta?.links,
          page: data.meta.current_page,
          limit: data.meta.per_page,
          from: data.meta.from,
          to: data.meta.to,
          total: data.meta.total,
        };
      }
      state.userReports.loading = loading;
    },
    setUserPurchaseReportsLoading: (state, loading) => {
      state.userPurchaseReports.loading = loading;
    },

    setUserPurchaseReports(state, [loading, data = null]) {
      if (data) {
        state.userPurchaseReports = {
          ...state.userPurchaseReports,
          data: data.data,
          links: data.meta?.links,
          page: data.meta.current_page,
          limit: data.meta.per_page,
          from: data.meta.from,
          to: data.meta.to,
          total: data.meta.total,
        };
      }
      state.userPurchaseReports.loading = loading;
    },
    setUserBuyReportLoading: (state, loading) => {
      state.userBuyReports.loading = loading;
    },

    setUserBuyReports(state, [loading, data = null]) {
      if (data) {
        state.userBuyReports = {
          ...state.userBuyReports,
          data: data.data,
          links: data.meta?.links,
          page: data.meta.current_page,
          limit: data.meta.per_page,
          from: data.meta.from,
          to: data.meta.to,
          total: data.meta.total,
        };
      }
      state.userBuyReports.loading = loading;
    },
    notify: (state, { message, type }) => {
      state.notification.show = true;
      state.notification.type = type;
      state.notification.message = message;
      setTimeout(() => {
        state.notification.show = false;
      }, 6000);
    },
  },
  notify_error: (state, { message, type }) => {
    state.error.show = true;
    state.error.type = type;
    state.error.message = message;
    setTimeout(() => {
      state.error.show = false;
    }, 5000);
  },
  modules: {},
});

export default store;
