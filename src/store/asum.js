const API_ROOT = 'http://127.0.0.1:8000/asum/api';

export default {
    namespaced: true,

    state: {
        soaRecords: [],
        isLoading: false,
        error: null,
    },

    getters: {
        allSoaRecords: (state) => state.soaRecords,
        recordCount: (state) => state.soaRecords.length,
        isLoading: (state) => state.isLoading,
        error: (state) => state.error,
    },

    mutations: {
        SET_SOA_RECORDS(state, records) {
            state.soaRecords = records;
        },
        SET_LOADING(state, status) {
            state.isLoading = status;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        CLEAR_SOA_RECORDS(state) {
            state.soaRecords = [];
            state.error = null;
        }
    },

    actions: {
        /**
         * Uploads main & reference files along with jenis_soa ('PREMI' or 'KLAIM')
         * to process ASUM allocation via Django backend.
         */
        async importSoaAsum({ commit }, { mainFile, referenceFile, jenisSoa = 'PREMI' }) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            const formData = new FormData();
            formData.append('main_file', mainFile);
            formData.append('reference_file', referenceFile);
            formData.append('jenis_soa', String(jenisSoa).toUpperCase());
            formData.append('export_format', 'json');

            const headers = {};
            if (token) {
                headers['Authorization'] = `Token ${token}`;
            }

            try {
                const response = await fetch(`${API_ROOT}/import-soa-asum/`, {
                    method: 'POST',
                    headers,
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: response.statusText }));
                    throw new Error(errorData.error || errorData.message || `HTTP error! Status ${response.status}`);
                }

                const responseData = await response.json();
                
                // Read from results array or direct array
                const records = responseData.results || (Array.isArray(responseData) ? responseData : []);

                commit('SET_SOA_RECORDS', records);
                return records;

            } catch (error) {
                console.error("Error importing SOA ASUM data:", error);
                commit('SET_ERROR', error.message);
                commit('SET_SOA_RECORDS', []);
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },

        resetSoaState({ commit }) {
            commit('CLEAR_SOA_RECORDS');
        }
    },
};