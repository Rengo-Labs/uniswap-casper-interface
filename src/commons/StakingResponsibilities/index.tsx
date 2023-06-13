import {apiClient} from "../../contexts/ConfigContext";
import {
    signAndDeployClaim,
    signAndDeployDeposit,
    signAndDeployWithdraw
} from '../deploys/liquidity_gauge_v3'
import {Client as CasperClient, Wallet} from "../wallet";
import BigNumber from "bignumber.js";
import {convertUIStringToBigNumber} from "../utils";


export interface StakingResponsibilitiesProps {
    casperClient: CasperClient,
    wallet: Wallet
}

const StakingResponsibilities = ({casperClient, wallet}: StakingResponsibilitiesProps) => {
    // TODO Add params

    const onAddStake = (amount: BigNumber) => {
        return signAndDeployDeposit(casperClient, wallet, amount)
    }

    const onRemoveStake = (amount: BigNumber) => {
        return signAndDeployWithdraw(casperClient, wallet, amount)
    }

    const onClaimRewards = () => {
        return signAndDeployClaim(casperClient, wallet)
    }

    const getBalance = (contractHash: string) => {
        return apiClient.getERC20Balance(wallet, contractHash)
    }

    return {
        onAddStake,
        onRemoveStake,
        onClaimRewards,
        getBalance
    }
}

export default StakingResponsibilities
