import { ConnectorState } from "@/store/modules/connector/types";
import { ToastState } from "@/store/modules/toast/type";
import { LoaderState } from "@/store/modules/loader/types";
import { ApproveState } from "@/store/modules/approve/types";
import { KnifeState } from "@/store/modules/knife/types";
import { StakingKnifeState } from "@/store/modules/stakingKnife/types";
import { SupplyState } from "@/store/modules/supply/types";
import { RaffleState } from "@/store/modules/raffle/types";

export interface RootState {
  loader: LoaderState;
  approve: ApproveState;
  connector: ConnectorState;
  toast: ToastState;
  knife: KnifeState;
  stakingKnife: StakingKnifeState;
  supply: SupplyState;
  raffle: RaffleState;
}
