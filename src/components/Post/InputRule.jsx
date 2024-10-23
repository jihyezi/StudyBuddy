import React, { useState, useEffect } from "react";
import styles from "./InputRule.module.css";
import "fonts/Font.css";

//icon
import add from "assets/icons/Post/add.png";
import cancel from "assets/icons/Post/close.png";

const InputRule = (props) => {
  const [rules, setRules] = useState([
    { id: 1, text: "존중하고 서로 배려하며 예의를 지켜요", isEditing: false },
  ]);

  useEffect(() => {
    updateRules();
  }, []);

  const updateRules = () => {
    props.onRulesChange(rules);
  };

  const handleAddRule = () => {
    const newRule = {
      id: rules.length + 1,
      text: "규칙을 입력해주세요.",
      isEditing: false,
    };
    setRules([...rules, newRule]);
    updateRules();
  };

  const handleDeleteRule = (id) => {
    if (id !== 1) {
      setRules(rules.filter((rule) => rule.id !== id));
      updateRules();
    }
  };

  const handleToggleEdit = (id) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, isEditing: !rule.isEditing } : rule
      )
    );
    updateRules();
  };

  const handleChangeRuleText = (id, newText) => {
    setRules(
      rules.map((rule) => (rule.id === id ? { ...rule, text: newText } : rule))
    );
    updateRules();
  };

  const handleKeyPress = (e, id) => {
    if (e.key === "Enter") {
      handleToggleEdit(id);
    }
  };

  return (
    <div>
      <div className={styles.inputContainer}>
        <div className={styles.inputTitle}>{props.title}</div>
        <div className={styles.addContainer} onClick={handleAddRule}>
          <img className={styles.addIcon} src={add} alt="add" />
          <div className={styles.addText}>추가하기</div>
        </div>
      </div>
      {rules.map((rule) => (
        <div key={rule.id} className={styles.ruleContainer}>
          <div className={styles.ruleNumberContainer}>
            <div className={styles.ruleNumber}>{rule.id}</div>
          </div>
          {rule.isEditing ? (
            <input
              className={styles.ruleTextInput}
              type="text"
              value={rule.text}
              onChange={(e) => handleChangeRuleText(rule.id, e.target.value)}
              onBlur={() => handleToggleEdit(rule.id)}
              onKeyPress={(e) => handleKeyPress(e, rule.id)}
              autoFocus
              style={{
                border: "none",
                color: "#b6b6b6",
                fontFamily: "NotoSans-SemiBold",
                width: "100%",
                outline: "none",
              }}
            />
          ) : (
            <div
              className={styles.ruleText}
              onClick={() => handleToggleEdit(rule.id)}
            >
              {rule.text}
            </div>
          )}
          {rule.id !== 1 && (
            <img
              className={styles.cancelIcon}
              src={cancel}
              alt="cancel"
              onClick={() => handleDeleteRule(rule.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default InputRule;
