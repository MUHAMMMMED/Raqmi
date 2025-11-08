import AxiosInstance from "./AxiosInstance";

const API = "slides/blocks";

// GET all blocks for a slide
export const getSlideBlocks = (slideId) =>
    AxiosInstance.get(`${API}/?slide=${slideId}`);

// GET single block by ID
export const getSlideBlock = (id) =>
    AxiosInstance.get(`${API}/${id}/`);

// CREATE a new block
export const createSlideBlock = (data) =>
    AxiosInstance.post(API, data);

// UPDATE an existing block
export const updateSlideBlock = (id, data) =>
    AxiosInstance.put(`${API}/${id}/`, data);

// DELETE a block
export const deleteSlideBlock = (id) =>
    AxiosInstance.delete(`${API}/${id}/`);

// UPDATE order of blocks
export const updateSlideBlockOrder = (blocks) =>
    AxiosInstance.post(`${API}/update-order/`, { blocks });







// import AxiosInstance from "./AxiosInstance";

// const API = "slides/blocks";

// // GET all blocks for a slide
// export const getSlideBlocks = (slideId) =>
//     AxiosInstance.get(`${API}/?slide=${slideId}`);

// // GET single block by ID
// export const getSlideBlock = (id) =>
//     AxiosInstance.get(`${API}/${id}/`);

// // CREATE a new block
// export const createSlideBlock = (data) =>
//     AxiosInstance.post(API, data);

// // UPDATE an existing block
// export const updateSlideBlock = (id, data) =>
//     AxiosInstance.put(`${API}/${id}/`, data);

// // DELETE a block
// export const deleteSlideBlock = (id) =>
//     AxiosInstance.delete(`${API}/${id}/`);

// // UPDATE order of blocks
// export const updateSlideBlockOrder = (blocks) =>
//     AxiosInstance.post(`${API}/update-order/`, { blocks });

// // NEW: Auto-save multiple blocks
// export const autoSaveBlocks = (blocks, slideId) =>
//     AxiosInstance.post(`${API}/auto-save/`, { blocks, slide_id: slideId });

// // NEW: Save slide properties
// export const updateSlideProperties = (slideId, data) =>
//     AxiosInstance.put(`slides/${slideId}/`, data);

// // NEW: Bulk create blocks
// export const bulkCreateBlocks = (blocks) =>
//     AxiosInstance.post(`${API}/bulk-create/`, { blocks });