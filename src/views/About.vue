<template>
  <vs-app>
    <vs-row>
      <!-- form data -->
      <vs-col
        vs-type="flex"
        vs-justify="space-around"
        vs-align="center"
        class="flex-dir-col mt-3"
        vs-lg="4"
        vs-sm="12"
      >
        <vs-select
          class="selectExample text-white"
          label="Choose Mode"
          v-model="mode"
          color="#103767"
        >
          <vs-select-item value="Encryption" text="Encryption Mode" />
          <vs-select-item value="Decryption" text="Decryption Mode" />
          <vs-select-item value="Cracking" text="Cracking Mode" />
        </vs-select>
        <vs-row class="mt-3">
          <vs-col
            vs-type="flex"
            vs-justify="space-around"
            vs-align="center"
            vs-lg="12"
            vs-sm="12"
          >
            <vs-input
              icon="search"
              size="large"
              :placeholder="inputPlaceholder"
              v-model="inputTextCabitalized"
            />
            <vs-input-number
              size="large"
              v-model="key"
              min="2"
              max="10"
              icon-inc="expand_less"
              icon-dec="expand_more"
              v-if="mode != 'Cracking'"
            />
          </vs-col>
        </vs-row>
        <vs-button
          v-if="mode == 'Encryption'"
          color="success"
          size="large"
          @click="encryptText"
          class="mt-1"
          >Encrypt</vs-button
        >
        <vs-button
          v-if="mode == 'Decryption'"
          color="success"
          size="large"
          @click="deencryptText"
          class="mt-1"
          >dEcrypt</vs-button
        >
        <vs-button
          v-if="mode == 'Cracking'"
          color="success"
          size="large"
          @click="crackText"
          class="mt-1"
          >Crack</vs-button
        >
      </vs-col>
      <vs-col
        vs-type="flex"
        vs-justify="space-around"
        vs-align="center"
        vs-lg="8"
        vs-sm="12"
        class="mt-3"
      >
        <img src="@/assets/lock.png" v-if="mode == 'Encryption'" />
        <img src="@/assets/unlock.png" v-else />
      </vs-col>
    </vs-row>

    <vs-row>
      <vs-col
        vs-type="flex"
        vs-justify="space-around"
        vs-align="center"
        vs-lg="12"
        vs-sm="12"
        class="mt-3"
      >
        <div class="result" v-if="result.length != 0">
          <h3>result</h3>
          <vs-row>
            <vs-col
              v-for="(item, index) in result"
              :key="index"
              vs-type="flex"
              vs-justify="space-around"
              vs-align="center"
              :vs-lg="mode == 'Cracking' ? 3 : 12"
              :vs-sm="12"
            >
              <div class="flex-center">
                <small v-if="mode == 'Cracking'">#key= {{ index + 2 }}</small>
                <h1>{{ item }}</h1>
                <hr class="seperator" />
              </div>
            </vs-col>
          </vs-row>
        </div>
      </vs-col>
    </vs-row>
  </vs-app>
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
    toEncryptOrDecrypt() {
      return this.inputTextCabitalized.replace(/\s/g, "");
    },
    key: {
      get() {
        return this.keyValue;
      },
      set(value) {
        this.keyValue = Number(value);
      }
    },
    inputPlaceholder() {
      if (this.mode == "Encryption") return "Text to Encrypt";
      else if (this.mode == "Cracking") return "Text to Crack";
      else return "Text to Decrypt";
    }
  },
  data() {
    return {
      mode: "Encryption",
      inputText: "",
      keyValue: 2,
      result: []
    };
  },
  methods: {
    encryptText() {
      // variables
      const str = this.toEncryptOrDecrypt;
      const key = Number(this.key);
      let keyArrays = [];
      this.result = [];
      let result = "";
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
          result += char;
        }
      }
      this.result.push(result);
    },
    deencryptText() {
      //variables
      const str = this.toEncryptOrDecrypt;
      const key = Number(this.key);
      this.result = [];
      let result = "";
      let keyArrays = [];
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
          result += keyArrays[keyLevel][count];
          keyLevel++;
          if (keyLevel == key) {
            increasing = false;
            keyLevel -= 2;
          }
          count++;
        } else {
          result += keyArrays[keyLevel][count];
          keyLevel--;
          if (keyLevel < 0) {
            increasing = true;
            keyLevel += 2;
          }
          count++;
        }
      }
      this.result.push(result);
    },
    deencryptTextFun(key) {
      //variables
      const str = this.toEncryptOrDecrypt;
      let result = "";
      let keyArrays = [];
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
          result += keyArrays[keyLevel][count];
          keyLevel++;
          if (keyLevel == key) {
            increasing = false;
            keyLevel -= 2;
          }
          count++;
        } else {
          result += keyArrays[keyLevel][count];
          keyLevel--;
          if (keyLevel < 0) {
            increasing = true;
            keyLevel += 2;
          }
          count++;
        }
      }
      return result;
    },
    crackText() {
      for (let index = 2; index < 10; index++) {
        this.result.push(this.deencryptTextFun(index));
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.mt-3 {
  margin-top: 3rem;
}
.mt-1 {
  margin-top: 1rem;
}
.flex-dir-col {
  flex-direction: column;
}
.result {
  color: white;
  border: white;
  border-style: solid;
  border-width: 1px;
  border-radius: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
  align-items: center;
  h1 {
    padding: 1rem;
  }
}
.seperator {
  width: 60%;
  color: white;
  margin-bottom: 3px;
}
.flex-center {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
