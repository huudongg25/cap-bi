import { createSlice } from '@reduxjs/toolkit';

const vehicleAccreditationSlice = createSlice({
	name: 'vehicleAccreditationSlice',
	initialState: {
		dataMain: {
			id: '',
			licensePlates: '',
			dateOfViolation: '',
			violation: "",
			location: "",
			officersStickFines: '',
			dateSend: '',
			handlingOfficer: '',
			finePaymentDate: '',
			images: [],
			// arrLinkOldImg: ""
		},
	},
	reducers: {
		getData: (state, action) => {
			state.dataMain.id = action.payload.Id;
			state.dataMain.licensePlates = action.payload.LicensePlates;
			state.dataMain.dateOfViolation = action.payload.DateOfViolation;
			state.dataMain.violation = action.payload.Violation;
			state.dataMain.dateSend = action.payload.DateSend;
			state.dataMain.officersStickFines = action.payload.OfficersStickFines;
			state.dataMain.location = action.payload.Location;
			state.dataMain.finePaymentDate = action.payload.FinePaymentDate;
			state.dataMain.handlingOfficer = action.payload.HandlingOfficer;
			state.dataMain.images = action.payload.Images;
			// state.dataMain.arrLinkOldImg = action.payload.ArrLinkOldImg
		},
	},
});

export const { getData } = vehicleAccreditationSlice.actions;

export default vehicleAccreditationSlice.reducer;
