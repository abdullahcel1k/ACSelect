import { useState, FC, useEffect, useRef, KeyboardEvent } from "react";
import styles from "./Select.module.scss";
import { Character } from "../core/models";

type SelectOption = {
  value: string | number;
  label: string;
};

type SelectProps = {
  options?: SelectOption[];
  optionsRequest?: (key: string) => Promise<Character[] | null>;
};

type BoldifyProps = {
  label: string;
  keyword: string;
};

const BoldifyText: FC<BoldifyProps> = ({ label, keyword }) => {
  const boldifyMatches = (text: string, keyword: string): string => {
    const regex = new RegExp(
      "(" + keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
      "gi"
    );
    const boldText = text.replace(regex, "<b>$1</b>");
    return boldText;
  };

  const boldText = label ? boldifyMatches(label, keyword) : "";

  return <div dangerouslySetInnerHTML={{ __html: boldText }} />;
};

const Select: FC<SelectProps> = ({ options, optionsRequest }) => {
  const [selectedItems, setSelectedItems] = useState<Character[]>([]);
  const [_options, _setOptions] = useState<any[]>(options || []);
  const [searchKey, setSearchKey] = useState<string>("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const modalRef = useRef<HTMLUListElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (optionsRequest) {
        const characterData = await optionsRequest(searchKey);
        if (characterData) {
          _setOptions(characterData);
        }
      }
    };

    fetchData();
  }, [searchKey]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowOptionsModal(false);
        setSearchKey("");
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    // Scroll to highlighted index
    if (highlightedIndex !== null && modalRef.current) {
      const highlightedItem = modalRef.current.children[highlightedIndex];
      if (highlightedItem) {
        const listRect = modalRef.current.getBoundingClientRect();
        const itemRect = highlightedItem.getBoundingClientRect();
        if (itemRect.bottom > listRect.bottom) {
          modalRef.current.scrollTo({
            top: modalRef.current.scrollTop + itemRect.bottom - listRect.bottom,
            behavior: "smooth",
          });
        } else if (itemRect.top < listRect.top) {
          modalRef.current.scrollTo({
            top: modalRef.current.scrollTop - listRect.top + itemRect.top,
            behavior: "smooth",
          });
        }
      }
    }
  }, [highlightedIndex]);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLUListElement | HTMLInputElement>
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const index = highlightedIndex !== null ? highlightedIndex : -1;
      let nextIndex = index + (event.key === "ArrowDown" ? 1 : -1);
      if (nextIndex < 0) nextIndex = _options.length - 1;
      if (nextIndex >= _options.length) nextIndex = 0;
      setHighlightedIndex(nextIndex);
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedIndex !== null) {
        const option = _options[highlightedIndex];
        if (selectedItems.find((item) => item.id === option.id)) {
          setSelectedItems(
            selectedItems.filter((i: Character) => i.id !== option.id)
          );
        } else {
          setSelectedItems([...selectedItems, option]);
        }
      }
    } else if (event.key === "Backspace" && !searchKey) {
      event.preventDefault();
      if (selectedItems.length > 0) {
        setSelectedItems(selectedItems.slice(0, selectedItems.length - 1));
      }
    }
  };

  return _options ? (
    <div className={styles.selectContainer}>
      <label className={styles.selectLabel}>Select Your Character</label>
      <div className={styles.selectInputContainer}>
        <div className={styles.selectedItems}>
          {selectedItems.map((item: Character) => (
            <div className={styles.selectedItem}>
              <span className={styles.selectedItemLabel}>{item.name}</span>
              <span
                className={styles.selectedItemDelete}
                onClick={() => {
                  setSelectedItems(
                    selectedItems.filter((i: Character) => i.id !== item.id)
                  );
                }}
              >
                X
              </span>
            </div>
          ))}
          <input
            value={searchKey}
            onChange={(e) => {
              if (e.target.value) setShowOptionsModal(true);
              setSearchKey(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
        <img
          src="arrow-down.png"
          onClick={() => {
            setShowOptionsModal(!showOptionsModal);
          }}
        />
      </div>
      <ul
        className={`${styles.selectOptions} ${
          showOptionsModal ? styles.show : ""
        }`}
        ref={modalRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        {_options.map((option: Character, index) => {
          return (
            <li
              key={index}
              className={`${styles.selectOptionsItem} ${
                highlightedIndex === index ? styles.highlighted : ""
              }`}
              onMouseEnter={() => setHighlightedIndex(index)} // Fare ile üzerine gelindiğinde vurgulanmış öğeyi ayarlamak için
              onClick={() => {
                if (selectedItems.find((item) => item.id === option.id)) {
                  setSelectedItems(
                    selectedItems.filter((i: Character) => i.id !== option.id)
                  );
                } else {
                  setSelectedItems([...selectedItems, option]);
                }
              }}
            >
              <input
                type="checkbox"
                checked={
                  selectedItems.findIndex((i) => i.id === option.id) !== -1
                }
              />
              <img src={option.image} />
              <div className={styles.selectOptionsLabel}>
                <BoldifyText label={option.name} keyword={searchKey} />
                {option.episode.length} Episodes
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  ) : (
    <p>Veri yükleniyor...</p>
  );
};

export default Select;
