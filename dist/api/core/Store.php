<?php

namespace core;


class Store {
    private static $store = [];

    static public function set($name, $value) {
        self::$store[$name] = $value;
    }

    static public function get($name) {
        return self::$store[$name];
    }
}