import { Button, Modal } from 'antd';
import classnames from 'classnames';
import { gsap, TimelineLite, TweenLite } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import * as React from 'react';
import Confetti from 'react-confetti';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../../../';
import { lotFetch, rewardPost, RewardsDataResponse, RootState, selectLunarLots, selectUserInfo, User } from '../../../../modules';
import './LunarGameScreen.css';

gsap.registerPlugin(CSSPlugin);

// tslint:disable-next-line: no-empty-interface
interface LocationProps extends RouterProps {}

interface LunarGameState {
	isShowResultModal: boolean;
	awardsState: number[];
	valueResultModalState: number;
	isShowResultElm: boolean;
}

interface ReduxProps {
	user: User;
	loading: boolean;
}

interface DispatchProps {
	lotFetch: typeof lotFetch;
	rewardPost: typeof rewardPost;
}

export type LunarGameProps = LocationProps & IntlProps & ReduxProps & DispatchProps;

class LunarGame extends React.Component<LunarGameProps, LunarGameState> {
	public boxElements: Array<HTMLDivElement | null>;
	public boxBackElements: Array<HTMLDivElement | null>;
	public boxFrontElements: Array<HTMLImageElement | null>;
	public scrollTopElm: HTMLDivElement | null;
	public myTween: Array<ReturnType<typeof TweenLite.to>>;
	public timeLine: TimelineLite;
	public animationTimeOut: any[];

	constructor(props: LunarGameProps) {
		super(props);
		// reference to box the DOM node
		this.boxElements = [];
		// reference to childer box the DOM node handle animation flip
		this.boxBackElements = [];
		this.boxFrontElements = [];

		this.scrollTopElm = null;
		// reference to the animation
		this.myTween = [];
		this.animationTimeOut = [];
		this.timeLine = new TimelineLite({ paused: true });
		this.state = {
			isShowResultModal: false,
			isShowResultElm: false,
			valueResultModalState: 0,
			awardsState: [],
		};
	}

	public componentDidMount = () => {
		// check txid, avoid going wrong
		const query = new URLSearchParams(this.props.history.location.search);
		if (!query.get('txid')) {
			this.props.history.push('/lunar-tutorial');
		}

		// set UI
		const tweenVars = { autoAlpha: 0, x: 0, y: 20, ease: 'elastic.out(0.2, 0.1)' };
		this.myTween = this.boxElements.map(element => TweenLite.from(element, 0.5, tweenVars));

		// tslint:disable-next-line: ban
		this.myTween.forEach(tween => {
			this.timeLine.add(tween);
		});

		TweenLite.set(this.boxBackElements, { rotationY: -180 });

		this.playGame();
	};

	public boxsRender = () => {
		const { history, user } = this.props;
		// const {awardsState} = this.state;
		const query = new URLSearchParams(history.location.search);
		const txid = query.get('txid');
		const boxImg = require('../../assets/box.png');

		const handleClickBox = (index: number) => {
			this.setState({
				isShowResultElm: true,
			});
			//remove class shake animation
			// tslint:disable-next-line: ban
			this.boxFrontElements.forEach(elm => {
				elm && elm.classList.remove('shake-hover');
			});
			//loading
			const clickedElm = this.boxFrontElements.splice(index, 1)[0];
			clickedElm && clickedElm.classList.add('shake');

			const callback = (payload: RewardsDataResponse) => {
				const data = [...payload.fail_award];
				data.splice(index, 0, payload.success_award);
				const awardUpdate = data.map(value => value.award);
				//set value for bag
				// tslint:disable-next-line: ban
				this.boxBackElements.forEach((elm, i) => {
					const node = document.createElement('h3');
					const textNode = document.createTextNode(`${awardUpdate[i]} $`);
					node.appendChild(textNode);
					elm && elm.appendChild(node);
				});

				const timeDf = 1.5;
				const tempFrontElm = [...this.boxFrontElements];
				const tempBackElm = [...this.boxBackElements];
				const clickedFrontElm = tempFrontElm.splice(index, 1);
				const clickedBackElm = tempBackElm.splice(index, 1);

				//remove shake loadding api
				clickedElm && clickedElm.classList.remove('shake');

				TweenLite.to(clickedFrontElm, timeDf, { rotationY: 180 });
				TweenLite.to(clickedBackElm, timeDf, { rotationY: 0 });
				setTimeout(() => {
					TweenLite.to(tempFrontElm, timeDf, { rotationY: 180 });
					TweenLite.to(tempBackElm, timeDf, { rotationY: 0 });
				}, timeDf * 1000);
				setTimeout(() => {
					this.setState({
						awardsState: awardUpdate,
					});
					this.openResultModal(payload.success_award.award);
				}, timeDf * 1000 * 2);
			};

			user.uid &&
				txid &&
				this.props.rewardPost({
					// tslint:disable-next-line: binary-expression-operand-order
					uid: user.uid,
					txid: txid,
					cb: callback,
				});
		};

		return new Array(4).fill(null).map((_a, i) => (
			<div className="box" key={i} ref={div => (this.boxElements[i] = div)}>
				<img
					className="shake-hover"
					src={boxImg}
					alt="1"
					ref={ref => (this.boxFrontElements[i] = ref)}
					onClick={() => handleClickBox(i)}
				/>
				<div
					className={classnames('result', {
						'd-flex': this.state.isShowResultElm,
						'd-none': !this.state.isShowResultElm,
					})}
					ref={ref => (this.boxBackElements[i] = ref)}
				></div>
			</div>
		));
	};

	public playGame = () => {
		//click scroll top play game
		if (this.scrollTopElm) {
			this.scrollTopElm.scrollIntoView({ behavior: 'smooth' });
		}
		//restart animation timeline
		this.timeLine.restart();

		//set x for size image - browser
		let arrPositionX = [240, 80, -80, -240];
		let arrPositionY = [0, 0, 0, 0];

		if (window.innerWidth < 794) {
			arrPositionX = [180, 60, -60, -180];
		}

		if (window.innerWidth < 500) {
			arrPositionX = [60, -60, 60, -60];
			arrPositionY = [90, 90, -90, -90];
		}

		// tslint:disable-next-line: ban
		this.animationTimeOut.forEach(value => {
			clearTimeout(value);
		}); //clear animation - reset - handle the user's click spam
		this.animationTimeOut[0] = setTimeout(() => {
			this.myTween = this.boxElements.map((element, i) =>
				TweenLite.to(element, 0.5, { x: arrPositionX[i], y: arrPositionY[i], ease: 'elastic.out(0.2, 0.1)' }),
			);
		}, 0.5 * 4 * 1000);
		this.animationTimeOut[1] = setTimeout(() => {
			this.myTween = this.boxElements.map(element =>
				TweenLite.to(element, 0.5, { x: 0, y: 0, ease: 'elastic.out(0.2, 0.1)' }),
			);
		}, 0.5 * 5 * 1000);
	};

	//result-modal
	public modalResultRender = () => {
		const { history } = this.props;
		const { isShowResultModal, valueResultModalState } = this.state;

		const bgResult = require('../../assets/bg-result.png');

		return (
			<Modal
				className="pg-lunar-game-modal-result"
				mask={false}
				visible={isShowResultModal}
				footer={null}
				onCancel={this.closeResultModal}
			>
				<div className="d-flex img-result">
					<img src={bgResult} alt="" />
				</div>
				<h2>{this.translate('page.body.lunar.modal.result.detail')}</h2>
				<h1 className="price">{valueResultModalState} USDT</h1>
				<div className="d-flex justify-content-center">
					<Button type="primary" danger onClick={() => history.push('/lunar-tutorial')}>
						Comfirm !
					</Button>
				</div>
			</Modal>
		);
	};
	public openResultModal = (award: number) => {
		this.setState({
			isShowResultModal: true,
			valueResultModalState: award,
		});
	};
	public closeResultModal = () => {
		this.setState({
			isShowResultModal: false,
		});
	};
	//end_result-modal

	public render() {
		const bgImg = require('../../assets/bg-op.jpg');
		const bgLeftImg = require('../../assets/bg-left.png');
		const bgRightImg = require('../../assets/bg-right.png');

		return (
			<div className="container-fluid pg-lunar-game" style={{ backgroundImage: `url(${bgImg})` }}>
				<div className="pg-lunar-game-parallax">
					<div className="left" style={{ backgroundImage: `url(${bgLeftImg})` }}></div>
					<div className="right" style={{ backgroundImage: `url(${bgRightImg})` }}></div>
				</div>
				<div className="container-fluid pg-lunar-game__inner">
					<div ref={ref => (this.scrollTopElm = ref)}>
						<a className="button-back" onClick={() => this.props.history.goBack()}>
							<div>
								<svg width={40} height={40} viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M12.109 15.008L23.332 3.781c.309-.305.48-.719.48-1.16 0-.438-.171-.852-.48-1.16l-.98-.98A1.637 1.637 0 0021.187 0c-.437 0-.851.172-1.16.48L6.668 13.843c-.312.309-.48.723-.48 1.16 0 .446.168.856.48 1.168L20.016 29.52c.309.309.723.48 1.16.48.442 0 .852-.171 1.16-.48l.985-.98a1.64 1.64 0 000-2.32z"
										fill="#faff00"
									/>
								</svg>
								<span>{this.translate('page.body.lunar.nav.back')}</span>
							</div>
						</a>
					</div>

					<h2 className="title-game">{this.translate('page.body.lunar.title')}</h2>
					<div className="wrapper-box">{this.boxsRender()}</div>
				</div>
				{this.modalResultRender()}
				{this.state.isShowResultModal && <Confetti width={window.innerWidth} height={window.innerHeight} />}
			</div>
		);
	}

	private translate = (key: string) => this.props.intl.formatMessage({ id: key });
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
	user: selectUserInfo(state),
	lots: selectLunarLots(state),
	loading: state.events.lunar.loading,
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
	lotFetch: (uid: string) => dispatch(lotFetch(uid)),
	rewardPost: ({ uid, txid, cb }: { uid: string; txid: string; cb: (payload: RewardsDataResponse) => void }) =>
		dispatch(rewardPost({ uid, txid, cb })),
});

export const LunarGameScreen = compose(
	injectIntl,
	withRouter,
	connect(mapStateToProps, mapDispatchProps),
)(LunarGame) as React.ComponentClass;
