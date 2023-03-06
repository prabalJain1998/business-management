const CACHE_SET = "CACHE_SET";

export const cacheReducer = (
  state = {
    useCacheOrder: false,
  },
  action
) => {
  switch (action.type) {
    case CACHE_SET:
      return {
        ...state,
        useCacheOrder: action.payload?.useCacheOrder,
      };
    default:
      return state;
  }
};
