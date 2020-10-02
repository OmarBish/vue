<template lang="html">
  <div class="centerx icons-example">
    <vs-input
      icon="search"
      placeholder="Search"
      v-model="inputTextCabitalized"
    />
    <div class="centerx">
      <vs-input-number
        v-model="key"
        min="2"
        max="8"
        icon-inc="expand_less"
        icon-dec="expand_more"
      />
    </div>
    <vs-button color="primary" type="border" @click="encryptText"
      >Encrypt</vs-button
    >
    <h1>{{ ecryptedText }}</h1>
    <vs-input
      icon="search"
      placeholder="Search"
      v-model="inputTextCabitalized"
    />
    <vs-button color="primary" type="border" @click="deencryptText"
      >dEcrypt</vs-button
    >
    <h1>{{ decryptedText }}</h1>
  </div>
</template>

<script>
export default {
  computed: {
    inputTextCabitalized: {
      get() {
        return this.inputText.toUpperCase();
      },
      set(value) {
        this.inputText = value;
      }
    },
    toEncrypt() {
      return this.inputTextCabitalized.replace(/\s/g, "");
    },
    key: {
      get() {
        return this.keyValue;
      },
      set(value) {
        this.keyValue = Number(value);
      }
    }
  },
  data() {
    return {
      inputText: "",
      keyValue: 2,

      ecryptedText: "",
      decryptedText: ""
    };
  },
  methods: {
    encryptText() {
      const str = this.toEncrypt;
      const key = Number(this.key);
      let keyArrays = [];
      this.ecryptedText = "";
      let count = 0;
      let keyLevel = 0;

      for (let index = 0; index < key; index++) {
        keyArrays.push([]);
      }
      let increasing = true;

      while (count < str.length) {
        if (increasing) {
          const char = str.charAt(count);
          keyArrays[keyLevel].push(char);
          keyLevel++;
          if (keyLevel == key) {
            increasing = false;
            keyLevel -= 2;
          }
          count++;
        } else {
          const char = str.charAt(count);
          keyArrays[keyLevel].push(char);
          keyLevel--;
          if (keyLevel < 0) {
            increasing = true;
            keyLevel += 2;
          }
          count++;
        }
      }
      for (let index = 0; index < keyArrays.length; index++) {
        const array = keyArrays[index];
        for (let charIndex = 0; charIndex < array.length; charIndex++) {
          const char = array[charIndex];
          this.ecryptedText += char;
        }
      }
    },
    deencryptText() {
      //variables
      const str = this.toEncrypt;
      const key = Number(this.key);
      this.decryptedText = "";
      let keyArrays = [];
      this.ecryptedText = "";
      let count = 0;
      let increasing = true;
      let keyLevel = 0;
      //creat level arrays and fill them with postion where the letter need to be placed
      for (let index = 0; index < key; index++) {
        keyArrays.push([]);
        for (let index2 = 0; index2 < str.length; index2++) {
          keyArrays[index].push("");
        }
      }
      for (let i = 0; i < str.length; i++) {
        if (increasing) {
          keyArrays[keyLevel][count] = "*";

          keyLevel++;
          if (keyLevel == key) {
            increasing = false;
            keyLevel -= 2;
          }
          count++;
        } else {
          keyArrays[keyLevel][count] = "*";
          keyLevel--;
          if (keyLevel < 0) {
            increasing = true;
            keyLevel += 2;
          }
          count++;
        }
      }
      increasing = true;
      count = 0;
      while (count < str.length) {
        for (let index = 0; index < keyArrays.length; index++) {
          const array = keyArrays[index];
          array.forEach((char, index2) => {
            if (char == "*") {
              keyArrays[index][index2] = str.charAt(count++);
            }
          });
        }
      }
      increasing = true;
      count = 0;
      keyLevel = 0;
      for (let i = 0; i < str.length; i++) {
        if (increasing) {
          this.decryptedText += keyArrays[keyLevel][count];
          keyLevel++;
          if (keyLevel == key) {
            increasing = false;
            keyLevel -= 2;
          }
          count++;
        } else {
          this.decryptedText += keyArrays[keyLevel][count];
          keyLevel--;
          if (keyLevel < 0) {
            increasing = true;
            keyLevel += 2;
          }
          count++;
        }
      }
    }
  }
};
</script>
