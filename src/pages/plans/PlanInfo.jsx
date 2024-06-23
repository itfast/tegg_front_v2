/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { translateError } from "../../services/util";
import { ModalMessage } from "../../components/ModalMessage/ModalMessage";
import { toast } from "react-toastify";
import { IoMdMore } from "react-icons/io";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

export const PlanInfo = ({ plan, search }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const ITEM_HEIGHT = 48;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const translateValue = (value) => {
    let converted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
    return converted;
  };

  const deletePlan = () => {
    setLoading(true);
    api.plans
      .delete(plan.Id)
      .then((res) => {
        toast.success(res?.data?.Message);
        setShowModal(false);
        search();
      })
      .catch((err) => translateError(err))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <tr>
        <td>{plan.Name}</td>
        {api.currentUser.AccessTypes[0] !== "CLIENT" && (
          <td>
            {plan.PointsForCarrerPlan} {t("plans.table.points")}
          </td>
        )}
        {api.currentUser.AccessTypes[0] !== "CLIENT" && (
          <td>{plan.Performance}%</td>
        )}
        <td>
          {`${translateValue(plan.Amount)} / ${translateValue(
            plan.MinimumInvestment
          )} /
                    ${translateValue(plan.MaximumInvestment)}`}
        </td>
        <td>{plan.Duration}</td>
        {api.currentUser.AccessTypes[0] !== "CLIENT" && (
          <td>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>{plan.EarningsCeiling || `${t("plans.table.not")}`}</div>
              <div>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <IoMdMore />
                </IconButton>
              </div>
            </div>
          </td>
        )}
      </tr>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "10ch",
          },
        }}
      >
        <MenuItem
          onClick={() =>
            navigate("/plans/info", {
              state: { plan: plan },
            })
          }
        >
          {t("plans.table.menu.details")}
        </MenuItem>
        {api.currentUser.AccessTypes[0] === "TEGG" && (
          <MenuItem
            onClick={() =>
              navigate("/plans/edit", {
                state: { plan: plan },
              })
            }
          >
            {t("plans.table.menu.edit")}
          </MenuItem>
        )}
      </Menu>
      <ModalMessage
        showModal={showModal}
        setShowModal={setShowModal}
        title={t("plans.table.modal.delete")}
        loading={loading}
        action={deletePlan}
        message={`${t("plans.table.menu.msg1")} ${plan.Name}${t(
          "plans.table.menu.msg2"
        )}`}
      />
    </>
  );
};
