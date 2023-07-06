import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { DepositDialogT, HandleModalDispatchT, PriceT } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { authStore } from "../stores";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { depositSchema } from "../schemas";
import { MODALACTIONS } from "../constant";

const WithdrawForm: React.FC<HandleModalDispatchT> = ({ dispatch }) => {
  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
    setValue,
    getValues,
  } = useForm<PriceT>({
    resolver: zodResolver(depositSchema),
  });

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      dispatch({ type: MODALACTIONS.WITHDRAW, payload: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<PriceT> = (values) => {
    authStore.withdraw(values);
  };

  const handleAdd = () => {
    const price_value = getValues("price");
    if (price_value >= 30000) return;
    setValue("price", Number.isNaN(price_value) ? 0 : price_value + 1);
  };

  const handleSubtract = () => {
    const price_value = getValues("price");
    if (price_value <= 0) return;
    setValue("price", Number.isNaN(price_value) ? 0 : price_value - 1);
  };
  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="deposit-form">
      Put your withdraw amount
      <Box className="deposit-input-box">
        <IconButton onClick={handleSubtract} aria-label="subtract">
          <Remove />
        </IconButton>
        <TextField
          InputProps={{
            endAdornment: <InputAdornment position="end">USD</InputAdornment>,
          }}
          type="number"
          variant="standard"
          error={!!errors["price"]}
          defaultValue={0}
          helperText={!!errors.price && errors.price.message}
          {...register("price", { valueAsNumber: true })}
        />
        <IconButton onClick={handleAdd} aria-label="add">
          <Add />
        </IconButton>
      </Box>
      <Button type="submit" variant="contained">
        Withdraw
      </Button>
    </form>
  );
};

export default WithdrawForm;
