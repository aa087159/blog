import React, { Component } from 'react';
import { createAccount } from '../components/Api';
import auth from '../components/Auth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { changeHandler, signupVerification } from '../actions';

export class Signup extends Component {
	state = {
		eye: false
	};

	changeHandler = (e) => {
		this.props.dispatch(
			changeHandler({
				[e.target.name]: e.target.value
			})
		);
	};

	submitHandler = async (e) => {
		e.preventDefault();
		const {
			userName,
			password,
			email,
			confirmPassword
		} = this.props.changeHandler;
		const signUpCredentials = await createAccount({
			email: email,
			userName: userName,
			password: password,
			confirmPassword: confirmPassword
		});

		const { message } = signUpCredentials;

		if (message === 'created') {
			this.props.dispatch(
				signupVerification({ isTaken: false, Inconsistent: false })
			);
			auth.signup(() => {
				this.props.history.push('/dashboard');
			});
		} else {
			this.props.dispatch(
				signupVerification({
					isTaken: message.taken,
					Inconsistent: message.inconsistency
				})
			);
		}
	};

	render() {
		const { eye } = this.state;
		const { isTaken, Inconsistent } = this.props.verification;
		//console.log(Inconsistent);

		return (
			<div className='min-w-screen min-h-screen bg-blue-900 flex flex-col'>
				<div className='flex justify-end flex-grow-0'>
					<Link to='/login' className=''>
						<button className='bg-gray-100 rounded-sm mx-5 my-3 px-3 py-1 text-black font-medium'>
							Login
						</button>
					</Link>
				</div>
				<div className='flex-grow flex justify-center'>
					<form
						//autoComplete='off'
						onSubmit={this.submitHandler}
						className='flex flex-col w-64 bg-transparent mx-auto my-auto'
					>
						{isTaken ? (
							<p className='text-white'>
								Username or email is taken
							</p>
						) : null}
						{Inconsistent ? (
							<p className='text-white'>
								passwords are not consistent
							</p>
						) : null}

						<input
							type='email'
							name='email'
							required
							placeholder='Email'
							onChange={this.changeHandler}
							className=' border-gray-400 border-solid border rounded-sm my-2 p-2'
						/>

						<input
							type='text'
							name='userName'
							required
							placeholder='User Name'
							onChange={this.changeHandler}
							className='border-gray-400 border-solid border rounded-sm my-2 p-2'
						/>
						<div className='relative w-64 h-11'>
							<input
								type={eye ? 'text' : 'password'}
								name='password'
								required
								placeholder='password'
								onChange={this.changeHandler}
								className='w-full border-gray-400 border-solid border rounded-sm my-2 p-2 absolute'
							/>

							<i
								className={`far ${
									eye ? 'fa-eye' : 'fa-eye-slash'
								} cursor-pointer absolute right-1 top-1.3`}
								onClick={() => {
									this.setState({ eye: !eye });
								}}
							></i>
						</div>
						<input
							type={eye ? 'text' : 'password'}
							name='confirmPassword'
							required
							placeholder='Confirm Password'
							onChange={this.changeHandler}
							className='border-gray-400 border-solid border rounded-sm my-2 p-2'
						/>
						<button
							type='submit'
							className='bg-blue-400 rounded-sm my-2 p-2 text-white font-medium'
						>
							Register
						</button>
					</form>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	changeHandler: state.changeHandler,
	verification: state.verification
});

export default connect(mapStateToProps)(Signup);
