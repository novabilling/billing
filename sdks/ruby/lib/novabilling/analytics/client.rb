# frozen_string_literal: true

module Novabilling
  module Analytics
    class Client
      # @param client [Novabilling::Internal::Http::RawClient]
      #
      # @return [void]
      def initialize(client:)
        @client = client
      end

      # Retrieve revenue metrics including total revenue, MRR (monthly recurring revenue), and revenue breakdown by
      # period. Supports filtering by date range and currency.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String, nil] :date_from
      # @option params [String, nil] :date_to
      # @option params [String, nil] :currency
      # @option params [Novabilling::Analytics::Types::GetRevenueAnalyticsRequestGroupBy, nil] :group_by
      #
      # @return [Novabilling::Types::RevenueAnalyticsResponse]
      def get_revenue(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        query_param_names = %i[date_from date_to currency group_by]
        query_params = {}
        query_params["dateFrom"] = params[:date_from] if params.key?(:date_from)
        query_params["dateTo"] = params[:date_to] if params.key?(:date_to)
        query_params["currency"] = params[:currency] if params.key?(:currency)
        query_params["groupBy"] = params[:group_by] if params.key?(:group_by)
        params.except(*query_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/analytics/revenue",
          query: query_params,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::RevenueAnalyticsResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Retrieve subscription metrics including active count, churn rate, new subscriptions, and status distribution.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String, nil] :date_from
      # @option params [String, nil] :date_to
      # @option params [String, nil] :currency
      # @option params [Novabilling::Analytics::Types::GetSubscriptionsAnalyticsRequestGroupBy, nil] :group_by
      #
      # @return [Novabilling::Types::SubscriptionAnalyticsResponse]
      def get_subscriptions(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        query_param_names = %i[date_from date_to currency group_by]
        query_params = {}
        query_params["dateFrom"] = params[:date_from] if params.key?(:date_from)
        query_params["dateTo"] = params[:date_to] if params.key?(:date_to)
        query_params["currency"] = params[:currency] if params.key?(:currency)
        query_params["groupBy"] = params[:group_by] if params.key?(:group_by)
        params.except(*query_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/analytics/subscriptions",
          query: query_params,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::SubscriptionAnalyticsResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Retrieve customer metrics including total count, new customers, and geographic distribution.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String, nil] :date_from
      # @option params [String, nil] :date_to
      # @option params [String, nil] :currency
      # @option params [Novabilling::Analytics::Types::GetCustomersAnalyticsRequestGroupBy, nil] :group_by
      #
      # @return [Novabilling::Types::CustomerAnalyticsResponse]
      def get_customers(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        query_param_names = %i[date_from date_to currency group_by]
        query_params = {}
        query_params["dateFrom"] = params[:date_from] if params.key?(:date_from)
        query_params["dateTo"] = params[:date_to] if params.key?(:date_to)
        query_params["currency"] = params[:currency] if params.key?(:currency)
        query_params["groupBy"] = params[:group_by] if params.key?(:group_by)
        params.except(*query_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/analytics/customers",
          query: query_params,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::CustomerAnalyticsResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Retrieve payment metrics including success rate, failure rate, total volume, and breakdown by payment provider.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String, nil] :date_from
      # @option params [String, nil] :date_to
      # @option params [String, nil] :currency
      # @option params [Novabilling::Analytics::Types::GetPaymentsAnalyticsRequestGroupBy, nil] :group_by
      # @option params [String, nil] :provider
      #
      # @return [Novabilling::Types::PaymentAnalyticsResponse]
      def get_payments(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        query_param_names = %i[date_from date_to currency group_by provider]
        query_params = {}
        query_params["dateFrom"] = params[:date_from] if params.key?(:date_from)
        query_params["dateTo"] = params[:date_to] if params.key?(:date_to)
        query_params["currency"] = params[:currency] if params.key?(:currency)
        query_params["groupBy"] = params[:group_by] if params.key?(:group_by)
        query_params["provider"] = params[:provider] if params.key?(:provider)
        params.except(*query_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/analytics/payments",
          query: query_params,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::PaymentAnalyticsResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # MRR breakdown by movement type (new, expansion, contraction, churn) and by plan.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String, nil] :date_from
      # @option params [String, nil] :date_to
      # @option params [String, nil] :currency
      # @option params [Novabilling::Analytics::Types::GetMrrBreakdownAnalyticsRequestGroupBy, nil] :group_by
      #
      # @return [Novabilling::Types::MrrBreakdownResponse]
      def get_mrr_breakdown(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        query_param_names = %i[date_from date_to currency group_by]
        query_params = {}
        query_params["dateFrom"] = params[:date_from] if params.key?(:date_from)
        query_params["dateTo"] = params[:date_to] if params.key?(:date_to)
        query_params["currency"] = params[:currency] if params.key?(:currency)
        query_params["groupBy"] = params[:group_by] if params.key?(:group_by)
        params.except(*query_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/analytics/mrr-breakdown",
          query: query_params,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::MrrBreakdownResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Gross revenue minus refunds and credit notes.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [String, nil] :date_from
      # @option params [String, nil] :date_to
      # @option params [String, nil] :currency
      # @option params [Novabilling::Analytics::Types::GetNetRevenueAnalyticsRequestGroupBy, nil] :group_by
      #
      # @return [Novabilling::Types::NetRevenueResponse]
      def get_net_revenue(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        query_param_names = %i[date_from date_to currency group_by]
        query_params = {}
        query_params["dateFrom"] = params[:date_from] if params.key?(:date_from)
        query_params["dateTo"] = params[:date_to] if params.key?(:date_to)
        query_params["currency"] = params[:currency] if params.key?(:currency)
        query_params["groupBy"] = params[:group_by] if params.key?(:group_by)
        params.except(*query_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/analytics/net-revenue",
          query: query_params,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::NetRevenueResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Monthly cohort retention matrix showing what percentage of each cohort is retained over time.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      # @option params [Integer, nil] :months
      #
      # @return [Novabilling::Types::ChurnCohortsResponse]
      def get_churn_cohorts(request_options: {}, **params)
        params = Novabilling::Internal::Types::Utils.normalize_keys(params)
        query_param_names = %i[months]
        query_params = {}
        query_params["months"] = params[:months] if params.key?(:months)
        params.except(*query_param_names)

        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/analytics/churn-cohorts",
          query: query_params,
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::ChurnCohortsResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end

      # Average customer LTV and lifespan, broken down by plan.
      #
      # @param request_options [Hash]
      # @param params [Hash]
      # @option request_options [String] :base_url
      # @option request_options [Hash{String => Object}] :additional_headers
      # @option request_options [Hash{String => Object}] :additional_query_parameters
      # @option request_options [Hash{String => Object}] :additional_body_parameters
      # @option request_options [Integer] :timeout_in_seconds
      #
      # @return [Novabilling::Types::LtvResponse]
      def get_lifetime_value(request_options: {}, **params)
        Novabilling::Internal::Types::Utils.normalize_keys(params)
        request = Novabilling::Internal::JSON::Request.new(
          base_url: request_options[:base_url],
          method: "GET",
          path: "api/analytics/ltv",
          request_options: request_options
        )
        begin
          response = @client.send(request)
        rescue Net::HTTPRequestTimeout
          raise Novabilling::Errors::TimeoutError
        end
        code = response.code.to_i
        if code.between?(200, 299)
          Novabilling::Types::LtvResponse.load(response.body)
        else
          error_class = Novabilling::Errors::ResponseError.subclass_for_code(code)
          raise error_class.new(response.body, code: code)
        end
      end
    end
  end
end
