import { ADD_PLACE } from '../actions/actionTypes';

const initialState = {
    places: []
}

const reducer = (state = initialState,action) => {
    switch(action.type) {
        case ADD_PLACE:

            return {
                ...state,
                places: state.places.concat({
                    name: action.placeName
                })
            };

        default:
            return state;

    }
};

export default reducer;