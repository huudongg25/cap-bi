import { deleteFile, uploadFiles } from '@/commonHandle';
import formatDate from '@/formatTime';
import BaseAxios from '@/store/setUpAxios';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { GoCloudUpload } from 'react-icons/go';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { checkIfEmptyValueExists } from '../../commonHandle';
import { ErrorMessages, SuccessMessages, Text, apiServer } from '../../constant';
import ImagesInCreatedModal from '../imagesInCreatedModal';
import SlideImages from '../slideImages';
import styles from './index.module.css';

const cx = classNames.bind(styles);

function ContentModal({ handleCloseModal, toggleIsUpdateSuccess, descTitle, addEvent, successToast, errorToast }) {
	const [textPlaceholder, setTextPlaceholder] = useState('textPlaceholder');
	const dataMain = useSelector((state) => state.vehicleAccreditationSlice.dataMain);
	const [readOnly, setReadOnly] = useState(true);
	const [licensePlates, setLicensePlates] = useState(dataMain?.licensePlates || '');
	const [dateOfViolation, setDateOfViolation] = useState(formatDate(String(dataMain?.dateOfViolation)) || '');
	const [violation, setViolation] = useState(dataMain?.violation || '');
	const [location, setLocation] = useState(dataMain?.location || '');
	const [officersStickFines, setOfficersStickFines] = useState(dataMain?.officersStickFines || '');
	const [dateSend, setDateSend] = useState(formatDate(String(dataMain.dateSend)) || '');
	const [handlingOfficer, setHandlingOfficer] = useState(dataMain.handlingOfficer || '');
	const [finePaymentDate, setFinePaymentDate] = useState(formatDate(String(dataMain?.finePaymentDate)) || '');
	const [images, setImages] = useState(eval(dataMain?.images) || []);
	const [isShowSlideImages, setIsShowSlideImages] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(null);


	const showSlideImage = (indexImage) => {
		setSelectedImageIndex(indexImage);
		setIsShowSlideImages(true);
	};

	const closeSlideImage = () => {
		setIsShowSlideImages(false);
	};

	useEffect(() => {
		if (dataMain && dataMain.id) setTextPlaceholder('dateText');
		if (addEvent) setReadOnly(false);
		inputRef.current.focus();
	}, []);

	const inputRef = useRef();

	const resetInputsModal = () => {
		setDateSend('');
		setLicensePlates('');
		setFinePaymentDate('');
		setViolation('');
		setTextPlaceholder('textPlaceholder');
		setOfficersStickFines('');
		setDateOfViolation('');
		setLocation('');
		setHandlingOfficer('');
	};

	const checkFormatDateBeforeSubmit = (date) => {
		if (String(date).slice(0, 3).includes('-') === false) date = formatDate(String(date));

		return date;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let formatedDateSend = checkFormatDateBeforeSubmit(dateSend);
		let formatedFinePaymentDate = checkFormatDateBeforeSubmit(finePaymentDate);
		let formatedDateOfViolation = checkFormatDateBeforeSubmit(dateOfViolation);
		let arrLinkOldImg = images.filter(item => typeof (item) == "string");
		let image = images.filter(item => typeof (item) !== "string");
		let dataCreateTracker = {
			dateSend: formatedDateSend,
			licensePlates,
			finePaymentDate: formatedFinePaymentDate,
			dateOfViolation: formatedDateOfViolation,
			violation,
			'images[]': image,
			location,
			handlingOfficer,
			officersStickFines,
			arrLinkOldImg: JSON.stringify(arrLinkOldImg)
		};

		let isExitsEmptyData = checkIfEmptyValueExists(dataCreateTracker);

		if (isExitsEmptyData) {
			if (!dateSend) {
				const dateSend = document.getElementById('sentDay');
				dateSend.style.border = Text.error.border;
			}
			if (licensePlates === '') {
				const licensePlates = document.getElementById('licensePlates');
				licensePlates.style.border = Text.error.border;
			}
			if (!finePaymentDate) {
				const finePaymentDate = document.getElementById('penaltyPaymentDate');
				finePaymentDate.style.border = Text.error.border;
			}
			if (violation === '') {
				const violation = document.getElementById('violation');
				violation.style.border = Text.error.border;
			}
			if (dateOfViolation !== ' ') {
				const dateOfViolation = document.getElementById('dateOfViolation');
				dateOfViolation.style.border = Text.error.border;
			}
			if (handlingOfficer == '') {
				const handlingOfficer = document.getElementById('handlingOfficer');
				handlingOfficer.style.border = Text.error.border;
			}
			if (location === '') {
				const location = document.getElementById('location');
				location.style.border = Text.error.border;
			}
			if (officersStickFines === '') {
				const officersStickFines = document.getElementById('officersStickFines');
				officersStickFines.style.border = Text.error.border;
			}
		} else {
			let url = apiServer.accreditation.create;
			let errorMessage = ErrorMessages.create;
			let successMessage = SuccessMessages.create;
			if (dataMain && dataMain.id) {
				url = apiServer.accreditation.edit + dataMain.id;
				successMessage = SuccessMessages.edit;
				errorMessage = ErrorMessages.edit;
				dataCreateTracker.id = dataMain.id;
			}

			BaseAxios({
				method: 'POST',
				url: url,
				data: dataCreateTracker,
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
				.then(() => {
					toggleIsUpdateSuccess();
					successToast(successMessage);
					resetInputsModal();
					handleCloseModal();
				})
				.catch(() => {
				});
		}
	};

	const handleSubmitKeyDown = (e) => {
		if (e.keyCode === 13) handleSubmit(e);
	};

	const inputRefOfIconUpload = useRef(null);

	const handleImagesUpload = (e) => {
		e.stopPropagation();
		inputRefOfIconUpload.current.click();
	};

	const handleFilesSelect = (e) => {
		let imageFiles = uploadFiles(
			images,
			e.target.files,
			Text.fiveImageFiles,
			Text.twoMillionBytes,
			Text.imageTypes,
			Text.uploadFromModal,
		);
		if (imageFiles && imageFiles.length > 0) setImages(imageFiles);
	};

	const deleteImage = (index) => {
		let newImages = deleteFile(images, index);
		setImages(newImages);
	};

	return (
		<>
			{isShowSlideImages && (
				<SlideImages
					images={images}
					selectedImageIndex={selectedImageIndex}
					closeSlideImage={closeSlideImage}
				/>
			)}
			<form className={readOnly ? cx('bodyForm', 'readOnlyStyle') : cx('bodyForm')}>
				<div className={cx('inputArea')}>
					<div className={cx('finedPersonInfo')}>
						<div id="licensePlates" className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.licensePlates}
								<span>* </span>
							</label>
							<input
								onKeyDown={(e) => handleSubmitKeyDown(e)}
								readOnly={readOnly}
								className={cx('inputField')}
								required
								type="text"
								value={licensePlates}
								onChange={(e) => {
									const licensePlates = document.getElementById('licensePlates');
									licensePlates.style.borderColor = 'var(--border-color)';
									return setLicensePlates(e.target.value);
								}}
							/>
						</div>
						<div id="dateOfViolation" className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.dateOfViolation}
								<span>* </span>
							</label>
							<div className={cx('groupDate')}>
								<input
									readOnly={readOnly}
									className={cx('inputField', 'date')}
									required
									type="date"
									value={dateOfViolation}
									onChange={(e) => {
										const dateOfViolation = document.getElementById('dateOfViolation');
										dateOfViolation.style.borderColor = 'var(--border-color)';
										return setDateOfViolation(e.target.value);
									}}
								/>
								{readOnly && (
									<input
										className={cx('inputField', 'date', `${textPlaceholder}`)}
										required
										type="text"
										value={formatDate(String(dateOfViolation))}
										onChange={(e) => setDateOfViolation(formatDate(String(e.target.value)))}
										readOnly
									/>
								)}
							</div>
						</div>
					</div>
					<div className={cx('groupDays')}>
						<div id="violation" className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.violation}
								<span>* </span>
							</label>
							<input
								onKeyDown={(e) => handleSubmitKeyDown(e)}
								readOnly={readOnly}
								className={cx('inputField')}
								required
								type="text"
								value={violation}
								onChange={(e) => {
									const violation = document.getElementById('violation');
									violation.style.borderColor = 'var(--border-color)';
									return setViolation(e.target.value);
								}}
							/>
						</div>
						<div id="location" className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.location}
								<span>* </span>
							</label>
							<input
								onKeyDown={(e) => handleSubmitKeyDown(e)}
								readOnly={readOnly}
								className={cx('inputField')}
								required
								type="text"
								value={location}
								onChange={(e) => {
									const location = document.getElementById('location');
									location.style.borderColor = 'var(--border-color)';
									return setLocation(e.target.value);
								}}
							/>
						</div>
					</div>
					<div className={cx('finedPersonInfo')}>
						<div id="officersStickFines" className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.officersStickFines}
								<span>* </span>
							</label>
							<input
								onKeyDown={(e) => handleSubmitKeyDown(e)}
								readOnly={readOnly}
								className={cx('inputField')}
								required
								type="text"
								value={officersStickFines}
								onChange={(e) => {
									const officersStickFines = document.getElementById('officersStickFines');
									officersStickFines.style.borderColor = 'var(--border-color)';
									return setOfficersStickFines(e.target.value);
								}}
							/>
						</div>

						<div id="sentDay" className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.sentDate}
								<span>* </span>
							</label>
							<div className={cx('groupDate')}>
								<input
									ref={inputRef}
									readOnly={readOnly}
									className={cx('inputField', 'date')}
									required
									type="date"
									pattern="^\d{1,2}\/\d{1,2}\/\d{4}$"
									value={dateSend}
									onChange={(e) => {
										const dateSend = document.getElementById('sentDay');
										dateSend.style.borderColor = 'var(--border-color)';
										return setDateSend(e.target.value);
									}}
								/>
								{readOnly && (
									<input
										className={cx('inputField', 'date', `${textPlaceholder}`)}
										required
										type="text"
										value={formatDate(String(dateSend))}
										onChange={(e) => setDateSend(formatDate(String(e.target.value)))}
										readOnly
									/>
								)}
							</div>
						</div>
					</div>
					<div className={cx('finedPersonInfo')}>
						<div id="handlingOfficer" className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.handlingOfficer}
								<span>* </span>
							</label>
							<input
								onKeyDown={(e) => handleSubmitKeyDown(e)}
								readOnly={readOnly}
								className={cx('inputField')}
								required
								type="text"
								value={handlingOfficer}
								onChange={(e) => {
									const handlingOfficer = document.getElementById('handlingOfficer');
									handlingOfficer.style.borderColor = 'var(--border-color)';
									return setHandlingOfficer(e.target.value);
								}}
							/>
						</div>
						<div id="penaltyPaymentDate" className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.inspectionDepositBook.dateOfPaymentFfFines}
								<span>* </span>
							</label>
							<div className={cx('groupDate')}>
								<input
									readOnly={readOnly}
									className={cx('inputField', 'date')}
									required
									type="date"
									value={finePaymentDate}
									onChange={(e) => {
										const finePaymentDate = document.getElementById('penaltyPaymentDate');
										finePaymentDate.style.borderColor = 'var(--border-color)';
										return setFinePaymentDate(e.target.value);
									}}
								/>
								{readOnly && (
									<input
										className={cx('inputField', 'date', `${textPlaceholder}`)}
										required
										type="text"
										value={formatDate(String(finePaymentDate))}
										onChange={(e) => setFinePaymentDate(formatDate(String(e.target.value)))}
										readOnly
									/>
								)}
							</div>
						</div>
					</div>
					<div className={cx('images')}>
						<div className={cx('formField')}>
							<label className={cx('labelField')} htmlFor="">
								{Text.image}
								<GoCloudUpload
									title={Text.uploadImages}
									className={cx('iconUploadImages')}
									onClick={(e) => handleImagesUpload(e)}
								/>
								<input
									type="file"
									className={cx('hiddenInputUploadImages')}
									ref={inputRefOfIconUpload}
									onChange={(e) => handleFilesSelect(e)}
									multiple
									accept={Text.imageTypesString}
								/>
							</label>
							<ImagesInCreatedModal
								images={images}
								deleteImage={deleteImage}
								showSlideImage={showSlideImage}
							/>
						</div>
					</div>
				</div>
				<div className={cx('groupBtn')}>
					<div id="staffReceive" className={cx('noteModal')}>
						<span>{Text.inputRequired}</span>
					</div>
					<div className={cx('setButton')}>
						<button onClick={handleCloseModal} className={cx('btnCancel')}>
							{Text.CRUD.cancel}
						</button>
						{!readOnly && (
							<button type="submit" className={cx('btnSubmit')} onClick={handleSubmit}>
								Xong
							</button>
						)}
						{readOnly && (
							<button onClick={() => setReadOnly(false)} className={cx('btnSubmit')}>
								{descTitle}
							</button>
						)}
					</div>
				</div>
			</form>
		</>
	);
}

export default ContentModal;
